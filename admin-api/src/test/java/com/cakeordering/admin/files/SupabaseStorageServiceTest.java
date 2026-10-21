package com.cakeordering.admin.files;

import com.cakeordering.admin.files.config.SupabaseStorageProperties;
import com.cakeordering.admin.files.dto.UploadResult;
import com.cakeordering.admin.files.exception.StorageException;
import com.cakeordering.admin.files.service.SupabaseStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class SupabaseStorageServiceTest {

    private static final byte[] PNG = new byte[] {(byte) 0x89, 'P', 'N', 'G'};

    private MockRestServiceServer server;
    private SupabaseStorageService service;

    private void createService(String url, String key) {
        SupabaseStorageProperties properties = new SupabaseStorageProperties();
        properties.setUrl(url);
        properties.setKey(key);
        properties.setBucket("cake-images");
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new SupabaseStorageService(builder, properties);
    }

    @Test
    void uploadsImageAndReturnsPublicUrl() {
        createService("https://demo.supabase.co/", "test-key");

        server.expect(request -> {
                    String path = request.getURI().getPath();
                    assertThat(path).startsWith("/storage/v1/object/cake-images/cakes/");
                    assertThat(path).endsWith(".png");
                    assertThat(request.getHeaders().getFirst("Authorization")).isEqualTo("Bearer test-key");
                    assertThat(request.getHeaders().getFirst("apikey")).isEqualTo("test-key");
                    assertThat(request.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_PNG);
                    assertThat(request.getHeaders().getContentLength()).isEqualTo(PNG.length);
                })
                .andRespond(withSuccess("{\"Key\":\"cake-images/cakes/x.png\"}", MediaType.APPLICATION_JSON));

        MockMultipartFile file = new MockMultipartFile("file", "slice.png", "image/png", PNG);
        UploadResult result = service.upload(file, "cakes");

        server.verify();
        assertThat(result.bucket()).isEqualTo("cake-images");
        assertThat(result.path()).startsWith("cakes/").endsWith(".png");
        assertThat(result.url())
                .startsWith("https://demo.supabase.co/storage/v1/object/public/cake-images/cakes/")
                .endsWith(".png");
    }

    @Test
    void mapsSupabaseRejectionToGatewayError() {
        createService("https://demo.supabase.co", "bad-key");
        server.expect(request -> assertThat(request.getURI().getPath())
                        .startsWith("/storage/v1/object/cake-images/cakes/"))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED));

        MockMultipartFile file = new MockMultipartFile("file", "slice.jpg", "image/jpeg", PNG);
        assertThatThrownBy(() -> service.upload(file, "cakes"))
                .isInstanceOf(StorageException.class)
                .satisfies(ex -> {
                    StorageException storage = (StorageException) ex;
                    assertThat(storage.getStatus()).isEqualTo(HttpStatus.BAD_GATEWAY);
                    assertThat(storage.getMessage()).contains("SUPABASE_SERVICE_ROLE_KEY");
                });
    }

    @Test
    void rejectsUnsupportedFileType() {
        createService("https://demo.supabase.co", "test-key");
        MockMultipartFile file = new MockMultipartFile("file", "notes.txt", "text/plain", "hi".getBytes());

        assertThatThrownBy(() -> service.upload(file, "cakes"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported image type");
    }

    @Test
    void reportsMissingConfiguration() {
        createService("", "");

        assertThatThrownBy(() -> service.upload(
                new MockMultipartFile("file", "slice.png", "image/png", PNG), "cakes"))
                .isInstanceOf(StorageException.class)
                .hasMessageContaining("SUPABASE_URL");
    }
}
