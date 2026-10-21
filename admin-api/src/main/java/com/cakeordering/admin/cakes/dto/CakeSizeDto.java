package com.cakeordering.admin.cakes.dto;

import com.cakeordering.admin.cakes.model.CakeSize;

import java.math.BigDecimal;

public record CakeSizeDto(
    Integer id,
    String label,
    BigDecimal extraPrice,
    BigDecimal basePrice
) {
    public static CakeSizeDto from(CakeSize size) {
        return new CakeSizeDto(size.getId(), size.getLabel(), size.getExtraPrice(), size.getBasePrice());
    }
}
