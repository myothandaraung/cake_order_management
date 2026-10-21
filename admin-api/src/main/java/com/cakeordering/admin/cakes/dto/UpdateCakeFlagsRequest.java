package com.cakeordering.admin.cakes.dto;

public record UpdateCakeFlagsRequest(
    Boolean isPopular,
    Boolean isNewArrival
) {}
