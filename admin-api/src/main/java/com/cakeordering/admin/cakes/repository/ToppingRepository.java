package com.cakeordering.admin.cakes.repository;

import com.cakeordering.admin.cakes.model.Topping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToppingRepository extends JpaRepository<Topping, String> {
}
