package com.cakeordering.admin.cakes.repository;

import com.cakeordering.admin.cakes.model.CakeFlavor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CakeFlavorRepository extends JpaRepository<CakeFlavor, UUID> {
}
