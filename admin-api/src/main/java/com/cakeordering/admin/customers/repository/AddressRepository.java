package com.cakeordering.admin.customers.repository;

import com.cakeordering.admin.customers.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUserId(String userId);
}
