package com.cakeordering.admin.orders.dto;

import com.cakeordering.admin.orders.model.OrderItem;
import java.math.BigDecimal;

public record OrderItemDto(
    String id,
    String cakeId,
    Integer sizeId,
    String flavorId,
    String toppingIds,
    String message,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal lineTotal
) {
    public static OrderItemDto from(OrderItem item) {
        return new OrderItemDto(
            item.getId() != null ? item.getId().toString() : null,
            item.getCakeId(),
            item.getSizeId(),
            item.getFlavorId(),
            item.getToppingIds(),
            item.getMessage(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getLineTotal()
        );
    }
}
