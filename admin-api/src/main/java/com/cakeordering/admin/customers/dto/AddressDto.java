package com.cakeordering.admin.customers.dto;

import com.cakeordering.admin.customers.model.Address;

public record AddressDto(
    String id,
    String userId,
    String label,
    String street,
    String city,
    String state,
    String postalCode,
    String country,
    Boolean isDefault
) {
    public static AddressDto from(Address address) {
        return new AddressDto(
            address.getId() != null ? address.getId().toString() : null,
            address.getUserId(),
            address.getLabel(),
            address.getStreet(),
            address.getCity(),
            address.getState(),
            address.getPostalCode(),
            address.getCountry(),
            address.getIsDefault()
        );
    }
}
