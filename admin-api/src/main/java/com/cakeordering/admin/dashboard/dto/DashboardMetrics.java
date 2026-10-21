package com.cakeordering.admin.dashboard.dto;

import java.math.BigDecimal;

public record DashboardMetrics(
    BigDecimal revenue,
    Long orderCount,
    BigDecimal avgOrderValue,
    Long newCustomers
) {}
