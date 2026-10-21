package com.cakeordering.admin.users.controller;

import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.users.dto.AdminUserDto;
import com.cakeordering.admin.users.dto.CreateAdminUserRequest;
import com.cakeordering.admin.users.dto.UpdateAdminUserRequest;
import com.cakeordering.admin.users.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin-users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<AdminUserDto>> getAdminUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(adminUserService.getAdminUsers(page, size, sortBy, sortDir));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> createAdminUser(@Valid @RequestBody CreateAdminUserRequest request) {
        return ResponseEntity.ok(adminUserService.createAdminUser(request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateAdminUser(@PathVariable UUID id, @Valid @RequestBody UpdateAdminUserRequest request) {
        return ResponseEntity.ok(adminUserService.updateAdminUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdminUser(@PathVariable UUID id) {
        adminUserService.deleteAdminUser(id);
        return ResponseEntity.noContent().build();
    }
}
