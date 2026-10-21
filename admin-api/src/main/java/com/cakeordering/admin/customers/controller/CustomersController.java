package com.cakeordering.admin.customers.controller;

import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.customers.dto.*;
import com.cakeordering.admin.customers.service.CustomersService;
import com.cakeordering.admin.orders.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomersController {
    private final CustomersService customersService;

    @GetMapping
    public ResponseEntity<PageResponse<CustomerDto>> getCustomers(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(customersService.getCustomers(q, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailDto> getCustomerDetail(@PathVariable String id) {
        return ResponseEntity.ok(customersService.getCustomerDetail(id));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDto>> getCustomerOrders(@PathVariable String id) {
        return ResponseEntity.ok(customersService.getCustomerOrders(id));
    }

    @GetMapping("/{id}/favorites")
    public ResponseEntity<List<FavoriteDto>> getCustomerFavorites(@PathVariable String id) {
        return ResponseEntity.ok(customersService.getCustomerFavorites(id));
    }
}
