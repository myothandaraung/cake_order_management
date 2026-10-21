package com.cakeordering.admin.cakes.dto;

import com.cakeordering.admin.cakes.model.Topping;

import java.math.BigDecimal;

public record ToppingDto(
    String id,
    String name,
    BigDecimal extraPrice
) {
    public static ToppingDto from(Topping topping) {
        return new ToppingDto(topping.getId(), topping.getName(), topping.getExtraPrice());
    }
}
