package com.cakeordering.admin.cakes.repository;

import com.cakeordering.admin.cakes.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
