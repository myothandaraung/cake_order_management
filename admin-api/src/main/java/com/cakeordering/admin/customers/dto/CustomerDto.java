package com.cakeordering.admin.customers.dto;

import com.cakeordering.admin.customers.model.Profile;

import java.time.LocalDateTime;

public record CustomerDto(
    String id,
    String name,
    String email,
    String phone,
    String avatarUrl,
    LocalDateTime createdAt
) {
    public static CustomerDto from(Profile profile) {
        return new CustomerDto(
            profile.getId() != null ? profile.getId().toString() : null,
            profile.getName(),
            profile.getEmail(),
            profile.getPhone(),
            profile.getAvatarUrl(),
            profile.getCreatedAt()
        );
    }
}
