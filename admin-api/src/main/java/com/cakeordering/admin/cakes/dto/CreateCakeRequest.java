package com.cakeordering.admin.cakes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreateCakeRequest(
    @NotBlank String name,
    String description,
    String imageUrl,
    @NotNull @Positive BigDecimal price,
    Float rating,
    String categoryId,
    Boolean isPopular,
    Boolean isNewArrival,
    String tags
) {}
