package com.cakeordering.admin.common;

import com.cakeordering.admin.auth.model.Role;
import com.cakeordering.admin.users.model.AdminUser;
import com.cakeordering.admin.users.repository.AdminUserRepository;
import com.cakeordering.admin.cakes.repository.CategoryRepository;
import com.cakeordering.admin.cakes.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final AdminUserRepository adminUserRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        adminUserRepository.deleteAll();
        adminUserRepository.flush();
        if (adminUserRepository.count() == 0) {
            AdminUser admin = new AdminUser();
            admin.setName("Admin");
            admin.setEmail("admin@cake.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            adminUserRepository.save(admin);
        }
        if (categoryRepository.count() == 0) {
            Category category = new Category();
            category.setId(UUID.randomUUID());
            category.setName("Birthday Cakes");
            category.setSlug("birthday-cakes");
            categoryRepository.save(category);
        }
    }
}
