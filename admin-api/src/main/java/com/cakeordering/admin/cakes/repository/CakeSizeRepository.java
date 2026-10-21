package com.cakeordering.admin.cakes.repository;

import com.cakeordering.admin.cakes.model.CakeSize;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CakeSizeRepository extends JpaRepository<CakeSize, Integer> {
}
