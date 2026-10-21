package com.cakeordering.admin.orders.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UpdateOrderRequest(
    LocalDate deliveryDate,
    String deliveryAddress
) {}
