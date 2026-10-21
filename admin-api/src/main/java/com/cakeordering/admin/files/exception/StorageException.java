package com.cakeordering.admin.files.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/** Raised when an upload cannot be stored; mapped to an API error by the global handler. */
@Getter
public class StorageException extends RuntimeException {
    private final HttpStatus status;

    public StorageException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public static StorageException notConfigured() {
        return new StorageException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Image storage is not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the API.");
    }
}
