package com.cakeordering.admin.common.util;

import org.springframework.data.domain.Sort;

import java.util.Set;

/**
 * Builds Spring Data {@link Sort} instances from request parameters.
 *
 * <p>Query parameters arrive in snake_case (e.g. {@code created_at}) while JPA
 * sorts by entity attribute names (e.g. {@code createdAt}), so the incoming
 * value is normalised and validated against the entity's sortable properties.
 * Unknown values fall back to a safe default instead of failing the request.</p>
 */
public final class PaginationUtils {

    private PaginationUtils() {
    }

    public static Sort buildSort(String sortBy, String sortDir, Set<String> allowedProperties, String fallbackProperty) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = toCamelCase(sortBy);
        if (property == null || !allowedProperties.contains(property)) {
            property = fallbackProperty;
        }
        return Sort.by(direction, property);
    }

    static String toCamelCase(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        StringBuilder result = new StringBuilder(trimmed.length());
        boolean upperNext = false;
        for (char c : trimmed.toCharArray()) {
            if (c == '_' || c == '-') {
                upperNext = true;
            } else if (upperNext) {
                result.append(Character.toUpperCase(c));
                upperNext = false;
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }
}
