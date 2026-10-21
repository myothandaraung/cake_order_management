package com.cakeordering.admin.orders.service;

import com.cakeordering.admin.audit.service.AuditLogService;
import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.common.util.Ids;
import com.cakeordering.admin.orders.dto.OrderDto;
import com.cakeordering.admin.orders.dto.UpdateOrderRequest;
import com.cakeordering.admin.orders.dto.UpdateOrderStatusRequest;
import com.cakeordering.admin.orders.model.Order;
import com.cakeordering.admin.orders.model.OrderStatus;
import com.cakeordering.admin.orders.model.OrderItem;
import com.cakeordering.admin.orders.model.OrderStatusHistory;
import com.cakeordering.admin.orders.repository.OrderItemRepository;
import com.cakeordering.admin.orders.repository.OrderRepository;
import com.cakeordering.admin.orders.repository.OrderStatusHistoryRepository;
import com.cakeordering.admin.users.model.AdminUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> findAll(OrderStatus status, LocalDate from, LocalDate to, String q, Pageable pageable) {
        Page<Order> page = orderRepository.findAll(buildFilter(status, from, to, q), pageable);
        Map<UUID, List<OrderItem>> itemsByOrder = loadItems(page.getContent());
        return PageResponse.from(page.map(order -> OrderDto.from(order, itemsByOrder.getOrDefault(order.getId(), List.of()))));
    }

    private Map<UUID, List<OrderItem>> loadItems(List<Order> orders) {
        if (orders.isEmpty()) {
            return Map.of();
        }
        Collection<UUID> ids = orders.stream().map(Order::getId).toList();
        return orderItemRepository.findByOrderIdIn(ids).stream()
                .collect(Collectors.groupingBy(OrderItem::getOrderId));
    }

    private Specification<Order> buildFilter(OrderStatus status, LocalDate from, LocalDate to, String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), from.atStartOfDay()));
            }
            if (to != null) {
                predicates.add(cb.lessThan(root.get("orderDate"), to.plusDays(1).atStartOfDay()));
            }
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(cb.toString(root.get("orderNumber"))), pattern),
                        cb.like(cb.lower(root.get("deliveryAddress")), pattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional(readOnly = true)
    public OrderDto findById(String id) {
        Order order = orderRepository.findById(Ids.parse(id, "Order"))
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return OrderDto.from(order, orderItemRepository.findByOrderId(order.getId()));
    }

    @Transactional
    public OrderDto update(String id, UpdateOrderRequest request, AdminUser changedBy) {
        Order order = orderRepository.findById(Ids.parse(id, "Order"))
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (request.deliveryDate() != null) {
            order.setDeliveryDate(request.deliveryDate());
        }
        if (request.deliveryAddress() != null) {
            order.setDeliveryAddress(request.deliveryAddress());
        }
        orderRepository.save(order);
        try {
            auditLogService.log(changedBy, "orders", id, "UPDATE", objectMapper.writeValueAsString(request));
        } catch (Exception e) {
            // ignore
        }
        return OrderDto.from(order);
    }

    @Transactional
    public OrderDto updateStatus(String id, UpdateOrderStatusRequest request, AdminUser changedBy) {
        Order order = orderRepository.findById(Ids.parse(id, "Order"))
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        OrderStatus from = order.getStatus();
        OrderStatus to = request.status();
        
        if (from != to) {
            order.setStatus(to);
            orderRepository.save(order);
            
            OrderStatusHistory history = new OrderStatusHistory();
            history.setOrderId(order.getId().toString());
            history.setFromStatus(from);
            history.setToStatus(to);
            history.setChangedBy(changedBy);
            history.setReason(request.reason());
            orderStatusHistoryRepository.save(history);
        }
        try {
            auditLogService.log(changedBy, "orders", id, "STATUS_CHANGE", objectMapper.writeValueAsString(request));
        } catch (Exception e) {
            // ignore
        }
        return OrderDto.from(order);
    }

    @Transactional
    public OrderDto cancel(String id, String reason, AdminUser changedBy) {
        return updateStatus(id, new UpdateOrderStatusRequest(OrderStatus.cancelled, reason), changedBy);
    }
}
