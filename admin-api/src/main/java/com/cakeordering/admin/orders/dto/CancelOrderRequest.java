package com.cakeordering.admin.orders.dto;

import jakarta.validation.constraints.NotBlank;

public record CancelOrderRequest(
    @NotBlank
    String reason
) {}
