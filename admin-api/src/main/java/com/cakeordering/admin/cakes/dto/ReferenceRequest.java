package com.cakeordering.admin.cakes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ReferenceRequest {
    public record CategoryRequest(@NotBlank String name, String slug) {}
    public record CakeSizeRequest(@NotBlank String label, @Positive BigDecimal extraPrice, BigDecimal basePrice) {}
    public record CakeFlavorRequest(@NotBlank String name, @Positive BigDecimal extraPrice, BigDecimal basePrice) {}
    public record ToppingRequest(@NotBlank String name, @Positive BigDecimal extraPrice) {}
}
