package com.cakeordering.admin.dashboard.dto;

import java.math.BigDecimal;

public record TopCakeDto(
    String cakeId,
    String cakeName,
    Long quantity,
    BigDecimal revenue
) {}
