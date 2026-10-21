package com.cakeordering.admin.common.util;

import java.util.UUID;

public final class Ids {

    private Ids() {
    }

    /** Parses a UUID path/query identifier, rejecting malformed values with a 400. */
    public static UUID parse(String value, String entity) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(entity + " not found");
        }
        try {
            return UUID.fromString(value.trim());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(entity + " not found");
        }
    }
}
