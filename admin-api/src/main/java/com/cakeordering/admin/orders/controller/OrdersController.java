package com.cakeordering.admin.orders.controller;

import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.orders.dto.CancelOrderRequest;
import com.cakeordering.admin.orders.dto.OrderDto;
import com.cakeordering.admin.orders.dto.UpdateOrderRequest;
import com.cakeordering.admin.orders.dto.UpdateOrderStatusRequest;
import com.cakeordering.admin.orders.model.OrderStatus;
import com.cakeordering.admin.common.util.PaginationUtils;
import com.cakeordering.admin.orders.service.OrdersService;
import com.cakeordering.admin.users.model.AdminUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Set;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrdersController {
    private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "orderDate", "deliveryDate", "total", "status", "orderNumber");

    private final OrdersService ordersService;

    @GetMapping
    public ResponseEntity<PageResponse<OrderDto>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String q) {
        String[] sortParts = sort.split(",");
        String sortBy = sortParts[0];
        String sortDir = sortParts.length > 1 ? sortParts[1] : "desc";
        Pageable pageable = PageRequest.of(page, size, PaginationUtils.buildSort(sortBy, sortDir, SORTABLE, "createdAt"));
        return ResponseEntity.ok(ordersService.findAll(status, from, to, q, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> findById(@PathVariable String id) {
        return ResponseEntity.ok(ordersService.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(@PathVariable String id, 
                                                @Valid @RequestBody UpdateOrderStatusRequest request,
                                                @AuthenticationPrincipal AdminUser user) {
        return ResponseEntity.ok(ordersService.updateStatus(id, request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> update(@PathVariable String id,
                                         @Valid @RequestBody UpdateOrderRequest request,
                                         @AuthenticationPrincipal AdminUser user) {
        return ResponseEntity.ok(ordersService.update(id, request, user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OrderDto> updatePatch(@PathVariable String id,
                                               @Valid @RequestBody UpdateOrderRequest request,
                                               @AuthenticationPrincipal AdminUser user) {
        return ResponseEntity.ok(ordersService.update(id, request, user));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancel(@PathVariable String id,
                                         @Valid @RequestBody CancelOrderRequest request,
                                         @AuthenticationPrincipal AdminUser user) {
        return ResponseEntity.ok(ordersService.cancel(id, request.reason(), user));
    }
}
