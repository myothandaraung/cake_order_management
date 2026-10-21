package com.cakeordering.admin.orders.repository;

import com.cakeordering.admin.orders.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.UUID;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderIdIn(Collection<UUID> orderIds);

    List<OrderItem> findByOrderId(UUID orderId);
}
