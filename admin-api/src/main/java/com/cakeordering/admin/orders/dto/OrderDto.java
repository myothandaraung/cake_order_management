package com.cakeordering.admin.orders.dto;

import com.cakeordering.admin.orders.model.Order;
import com.cakeordering.admin.orders.model.OrderItem;
import com.cakeordering.admin.orders.model.OrderStatus;
import com.cakeordering.admin.orders.model.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderDto(
    String id,
    Integer orderNumber,
    LocalDateTime orderDate,
    LocalDate deliveryDate,
    String deliveryAddress,
    BigDecimal subtotal,
    BigDecimal deliveryFee,
    BigDecimal total,
    OrderStatus status,
    PaymentMethod paymentMethod,
    String userId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<OrderItemDto> items
) {
    public static OrderDto from(Order order) {
        return from(order, List.of());
    }

    public static OrderDto from(Order order, List<OrderItem> items) {
        return new OrderDto(
            order.getId() != null ? order.getId().toString() : null,
            order.getOrderNumber(),
            order.getOrderDate(),
            order.getDeliveryDate(),
            order.getDeliveryAddress(),
            order.getSubtotal(),
            order.getDeliveryFee(),
            order.getTotal(),
            order.getStatus(),
            order.getPaymentMethod(),
            order.getUserId() != null ? order.getUserId().toString() : null,
            order.getCreatedAt(),
            order.getUpdatedAt(),
            items == null ? List.of() : items.stream()
                .map(OrderItemDto::from)
                .collect(Collectors.toList())
        );
    }
}
