package com.cakeordering.admin.files.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Credentials for the Supabase Storage bucket that holds uploaded cake images.
 * <p>
 * Configure with {@code SUPABASE_URL} and {@code SUPABASE_SERVICE_ROLE_KEY}. The service
 * role key stays on the server; the browser only ever sees the public object URL.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "storage.supabase")
public class SupabaseStorageProperties {
    /** Project URL, e.g. https://abcdefgh.supabase.co (no trailing slash). */
    private String url;

    /** Service role key (or a key with storage write access). Never expose this to the browser. */
    private String key;

    /** Public bucket that holds the images. Must exist in the Supabase project. */
    private String bucket = "cake-images";

    /** Optional custom/CDN base, used instead of {url}/storage/v1/object/public when set. */
    private String publicBaseUrl;

    /** Maximum accepted upload size in megabytes. */
    private int maxFileSizeMb = 5;

    public boolean isConfigured() {
        return url != null && !url.isBlank() && key != null && !key.isBlank()
                && bucket != null && !bucket.isBlank();
    }
}
