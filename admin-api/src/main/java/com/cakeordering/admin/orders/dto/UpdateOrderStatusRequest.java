package com.cakeordering.admin.orders.dto;

import com.cakeordering.admin.orders.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull
    OrderStatus status,
    String reason
) {}
