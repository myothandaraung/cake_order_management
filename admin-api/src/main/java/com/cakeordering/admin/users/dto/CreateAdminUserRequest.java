package com.cakeordering.admin.users.dto;

import com.cakeordering.admin.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAdminUserRequest(
    @NotBlank @Email String email,
    @NotBlank String password,
    @NotBlank String name,
    @NotNull Role role
) {}
