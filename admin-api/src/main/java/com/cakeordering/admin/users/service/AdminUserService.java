package com.cakeordering.admin.users.service;

import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.common.util.PaginationUtils;
import com.cakeordering.admin.users.dto.AdminUserDto;
import com.cakeordering.admin.users.dto.CreateAdminUserRequest;
import com.cakeordering.admin.users.dto.UpdateAdminUserRequest;
import com.cakeordering.admin.users.model.AdminUser;
import com.cakeordering.admin.users.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "email", "name", "role");

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResponse<AdminUserDto> getAdminUsers(int page, int size, String sortBy, String sortDir) {
        Sort sort = PaginationUtils.buildSort(sortBy, sortDir, SORTABLE, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AdminUser> users = adminUserRepository.findAll(pageable);
        return PageResponse.from(users.map(AdminUserDto::from));
    }

    @Transactional
    public AdminUserDto createAdminUser(CreateAdminUserRequest request) {
        if (adminUserRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        AdminUser user = new AdminUser();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setRole(request.role());
        user.setIsActive(true);
        user = adminUserRepository.save(user);
        return AdminUserDto.from(user);
    }

    @Transactional
    public AdminUserDto updateAdminUser(UUID id, UpdateAdminUserRequest request) {
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));
        if (request.role() != null) user.setRole(request.role());
        if (request.isActive() != null) user.setIsActive(request.isActive());
        user = adminUserRepository.save(user);
        return AdminUserDto.from(user);
    }

    @Transactional
    public void deleteAdminUser(UUID id) {
        adminUserRepository.deleteById(id);
    }
}
