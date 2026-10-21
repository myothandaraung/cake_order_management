package com.cakeordering.admin.auth.dto;

import com.cakeordering.admin.users.dto.AdminUserDto;

public record AuthResponse(
    String accessToken,
    AdminUserDto user
) {}
