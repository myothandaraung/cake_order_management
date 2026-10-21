package com.cakeordering.admin.dashboard.service;

import com.cakeordering.admin.dashboard.dto.DashboardMetrics;
import com.cakeordering.admin.dashboard.dto.TopCakeDto;
import com.cakeordering.admin.orders.dto.OrderDto;
import com.cakeordering.admin.orders.model.Order;
import com.cakeordering.admin.orders.model.OrderStatus;
import com.cakeordering.admin.orders.repository.OrderRepository;
import com.cakeordering.admin.orders.service.OrdersService;
import com.cakeordering.admin.customers.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final OrdersService ordersService;
    private final ProfileRepository profileRepository;

    public DashboardMetrics getMetrics(LocalDate from, LocalDate to) {
        List<Order> orders = orderRepository.findAll();
        if (from != null || to != null) {
            orders = orders.stream()
                    .filter(o -> o.getOrderDate() != null)
                    .filter(o -> (from == null || !o.getOrderDate().isBefore(from.atStartOfDay()))
                            && (to == null || o.getOrderDate().isBefore(to.plusDays(1).atStartOfDay())))
                    .collect(Collectors.toList());
        }
        BigDecimal revenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.delivered)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long orderCount = orders.size();
        BigDecimal avgOrderValue = orderCount > 0 ? revenue.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        long newCustomers = profileRepository.findAll().size(); // Simplified
        return new DashboardMetrics(revenue, orderCount, avgOrderValue, newCustomers);
    }

    public List<OrderDto> getRecentOrders(int limit) {
        return ordersService.findAll(null, null, null, null,
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))).items();
    }

    public Map<String, Long> getOrdersByStatus(LocalDate from, LocalDate to) {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .filter(o -> o.getStatus() != null)
                .collect(Collectors.groupingBy(o -> o.getStatus().name(), Collectors.counting()));
    }

    public List<TopCakeDto> getTopCakes(int limit, LocalDate from, LocalDate to) {
        return List.of();
    }
}
