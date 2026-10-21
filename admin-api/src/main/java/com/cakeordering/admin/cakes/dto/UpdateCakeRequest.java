package com.cakeordering.admin.cakes.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateCakeRequest(
    String name,
    String description,
    String imageUrl,
    @Positive BigDecimal price,
    Float rating,
    String categoryId,
    Boolean isPopular,
    Boolean isNewArrival,
    String tags
) {}
