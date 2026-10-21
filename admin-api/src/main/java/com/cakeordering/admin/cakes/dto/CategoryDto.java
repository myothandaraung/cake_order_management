package com.cakeordering.admin.cakes.dto;

import com.cakeordering.admin.cakes.model.Category;

public record CategoryDto(
    String id,
    String name,
    String slug
) {
    public static CategoryDto from(Category category) {
        return new CategoryDto(category.getId() != null ? category.getId().toString() : null, category.getName(), category.getSlug());
    }
}
