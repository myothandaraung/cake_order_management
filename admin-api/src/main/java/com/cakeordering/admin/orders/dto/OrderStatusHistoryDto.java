package com.cakeordering.admin.orders.dto;

import com.cakeordering.admin.orders.model.OrderStatus;
import com.cakeordering.admin.orders.model.OrderStatusHistory;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrderStatusHistoryDto(
    UUID id,
    String orderId,
    OrderStatus fromStatus,
    OrderStatus toStatus,
    UUID changedBy,
    String changedByName,
    String reason,
    LocalDateTime changedAt
) {
    public static OrderStatusHistoryDto from(OrderStatusHistory history) {
        return new OrderStatusHistoryDto(
            history.getId(),
            history.getOrderId(),
            history.getFromStatus(),
            history.getToStatus(),
            history.getChangedBy() != null ? history.getChangedBy().getId() : null,
            history.getChangedBy() != null ? history.getChangedBy().getName() : null,
            history.getReason(),
            history.getChangedAt()
        );
    }
}
