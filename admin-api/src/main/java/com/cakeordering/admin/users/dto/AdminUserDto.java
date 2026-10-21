package com.cakeordering.admin.users.dto;

import com.cakeordering.admin.auth.model.Role;
import com.cakeordering.admin.users.model.AdminUser;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserDto(
    UUID id,
    String email,
    String name,
    Role role,
    Boolean isActive,
    LocalDateTime createdAt
) {
    public static AdminUserDto from(AdminUser user) {
        return new AdminUserDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getIsActive(),
            user.getCreatedAt()
        );
    }
}
