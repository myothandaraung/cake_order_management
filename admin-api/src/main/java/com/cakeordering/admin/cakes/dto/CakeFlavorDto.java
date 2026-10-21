package com.cakeordering.admin.cakes.dto;

import com.cakeordering.admin.cakes.model.CakeFlavor;

import java.math.BigDecimal;

public record CakeFlavorDto(
    String id,
    String name,
    BigDecimal extraPrice,
    BigDecimal basePrice
) {
    public static CakeFlavorDto from(CakeFlavor flavor) {
        return new CakeFlavorDto(flavor.getId() != null ? flavor.getId().toString() : null, flavor.getName(), flavor.getExtraPrice(), flavor.getBasePrice());
    }
}
