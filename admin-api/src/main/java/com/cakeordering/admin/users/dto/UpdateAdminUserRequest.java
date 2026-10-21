package com.cakeordering.admin.users.dto;

import com.cakeordering.admin.auth.model.Role;

public record UpdateAdminUserRequest(
    Role role,
    Boolean isActive
) {}
