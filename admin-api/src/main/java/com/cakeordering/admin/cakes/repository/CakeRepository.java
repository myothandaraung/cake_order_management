package com.cakeordering.admin.cakes.repository;

import com.cakeordering.admin.cakes.model.Cake;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CakeRepository extends JpaRepository<Cake, UUID>, JpaSpecificationExecutor<Cake> {
}
