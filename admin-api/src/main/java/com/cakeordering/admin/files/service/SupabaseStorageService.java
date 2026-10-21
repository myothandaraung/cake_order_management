package com.cakeordering.admin.files.service;

import com.cakeordering.admin.files.config.SupabaseStorageProperties;
import com.cakeordering.admin.files.dto.UploadResult;
import com.cakeordering.admin.files.exception.StorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Stores uploaded images in a Supabase Storage bucket and returns their public URL.
 * <p>
 * Uploads are proxied through the API so the service role key never reaches the browser.
 */
@Slf4j
@Service
public class SupabaseStorageService {

    private static final Pattern SAFE_FOLDER = Pattern.compile("[a-z0-9-]+");
    private static final Map<String, String> ALLOWED_TYPES = allowedTypes();

    private final RestClient restClient;
    private final SupabaseStorageProperties properties;

    public SupabaseStorageService(RestClient.Builder restClientBuilder, SupabaseStorageProperties properties) {
        this.properties = properties;
        String baseUrl = stripTrailingSlash(properties.getUrl());
        this.restClient = restClientBuilder
                .baseUrl(baseUrl.isEmpty() ? "http://localhost" : baseUrl)
                .build();
    }

    /**
     * Uploads an image and returns its public URL.
     *
     * @param file   the multipart image
     * @param folder optional folder inside the bucket, e.g. {@code cakes}
     */
    public UploadResult upload(MultipartFile file, String folder) {
        if (!properties.isConfigured()) {
            throw StorageException.notConfigured();
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please choose an image to upload.");
        }

        String contentType = resolveContentType(file);
        if (contentType == null) {
            throw new IllegalArgumentException("Unsupported image type. Use a JPG, PNG, WebP, GIF or AVIF image.");
        }
        long maxBytes = Math.max(1, properties.getMaxFileSizeMb()) * 1024L * 1024L;
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException(
                    "Images must be " + properties.getMaxFileSizeMb() + " MB or smaller.");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new IllegalArgumentException("The image could not be read. Please try again.");
        }

        String key = properties.getKey().trim();
        String bucket = properties.getBucket().trim();
        String objectPath = sanitizeFolder(folder) + "/" + UUID.randomUUID().toString().replace("-", "")
                + "." + ALLOWED_TYPES.get(contentType);
        URI uploadUri = URI.create(baseUrl() + "/storage/v1/object/" + encodePath(bucket + "/" + objectPath));

        log.debug("Uploading {} bytes to Supabase Storage at {}", bytes.length, uploadUri);

        try {
            restClient.post()
                    .uri(uploadUri)
                    .header("Authorization", "Bearer " + key)
                    .header("apikey", key)
                    .header("x-upsert", "true")
                    .header("cache-control", "31536000")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(bytes)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (request, response) -> {
                        throw failure(response.getStatusCode(), readBody(response));
                    })
                    .body(String.class);
        } catch (StorageException ex) {
            throw ex;
        } catch (RestClientException ex) {
            log.error("Could not reach Supabase Storage at {}", uploadUri, ex);
            throw new StorageException(HttpStatus.BAD_GATEWAY,
                    "Could not reach Supabase Storage. Check SUPABASE_URL and the network connection.");
        }

        String publicUrl = publicBaseUrl() + "/" + encodePath(bucket + "/" + objectPath);
        return new UploadResult(publicUrl, objectPath, bucket);
    }

    private StorageException failure(HttpStatusCode status, String body) {
        log.warn("Supabase Storage rejected an upload: {} {}", status, body);
        String hint = switch (status.value()) {
            case 400 -> "Supabase Storage rejected the upload. Check that the bucket exists and accepts this file.";
            case 401, 403 -> "Supabase Storage refused the credentials. Check SUPABASE_SERVICE_ROLE_KEY and the bucket policy.";
            case 404 -> "The storage bucket was not found. Create it in Supabase or change SUPABASE_STORAGE_BUCKET.";
            case 413 -> "The image is larger than the storage limit for this bucket.";
            default -> "Image upload failed (HTTP " + status.value() + ").";
        };
        return new StorageException(HttpStatus.BAD_GATEWAY, hint);
    }

    private static String readBody(ClientHttpResponse response) {
        try {
            byte[] body = response.getBody().readAllBytes();
            return body.length > 500 ? new String(body, 0, 500, StandardCharsets.UTF_8)
                    : new String(body, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            return "";
        }
    }

    private static String resolveContentType(MultipartFile file) {
        String declared = file.getContentType();
        if (declared != null) {
            String normalized = declared.toLowerCase(Locale.ROOT).split(";")[0].trim();
            if (ALLOWED_TYPES.containsKey(normalized)) {
                return normalized;
            }
        }
        String name = file.getOriginalFilename();
        if (name != null) {
            String extension = StringUtils.getFilenameExtension(name);
            if (extension != null) {
                String ext = extension.toLowerCase(Locale.ROOT);
                return ALLOWED_TYPES.entrySet().stream()
                        .filter(entry -> entry.getValue().equals(ext))
                        .map(Map.Entry::getKey)
                        .findFirst()
                        .orElse(null);
            }
        }
        return null;
    }

    private static String sanitizeFolder(String folder) {
        if (folder == null) {
            return "cakes";
        }
        String candidate = folder.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]", "");
        return SAFE_FOLDER.matcher(candidate).matches() && !candidate.isEmpty() ? candidate : "cakes";
    }

    private String baseUrl() {
        return stripTrailingSlash(properties.getUrl());
    }

    private String publicBaseUrl() {
        String custom = stripTrailingSlash(properties.getPublicBaseUrl());
        return custom.isEmpty() ? baseUrl() + "/storage/v1/object/public" : custom;
    }

    private static String stripTrailingSlash(String value) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    /** Encodes each path segment but keeps the separators so Supabase sees a nested key. */
    private static String encodePath(String path) {
        return Arrays.stream(path.split("/"))
                .map(segment -> UriUtils.encodePathSegment(segment, StandardCharsets.UTF_8))
                .collect(Collectors.joining("/"));
    }

    private static Map<String, String> allowedTypes() {
        Map<String, String> types = new LinkedHashMap<>();
        types.put("image/jpeg", "jpg");
        types.put("image/jpg", "jpg");
        types.put("image/png", "png");
        types.put("image/webp", "webp");
        types.put("image/gif", "gif");
        types.put("image/avif", "avif");
        return Map.copyOf(types);
    }
}
