package com.cakeordering.admin.customers.dto;

import java.util.List;

public record CustomerDetailDto(
    CustomerDto profile,
    List<AddressDto> addresses
) {}
