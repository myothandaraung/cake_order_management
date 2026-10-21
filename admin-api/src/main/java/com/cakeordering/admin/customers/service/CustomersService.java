package com.cakeordering.admin.customers.service;

import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.common.util.Ids;
import com.cakeordering.admin.common.util.PaginationUtils;
import com.cakeordering.admin.customers.dto.*;
import com.cakeordering.admin.customers.model.Profile;
import com.cakeordering.admin.customers.repository.AddressRepository;
import com.cakeordering.admin.customers.repository.FavoriteRepository;
import com.cakeordering.admin.customers.repository.ProfileRepository;
import com.cakeordering.admin.orders.dto.OrderDto;
import com.cakeordering.admin.orders.model.Order;
import com.cakeordering.admin.orders.repository.OrderRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomersService {
    private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "name", "email");

    private final ProfileRepository profileRepository;
    private final AddressRepository addressRepository;
    private final FavoriteRepository favoriteRepository;
    private final OrderRepository orderRepository;

    public PageResponse<CustomerDto> getCustomers(String q, int page, int size, String sortBy, String sortDir) {
        Sort sort = PaginationUtils.buildSort(sortBy, sortDir, SORTABLE, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Profile> profiles = profileRepository.findAll(buildFilter(q), pageable);
        return PageResponse.from(profiles.map(CustomerDto::from));
    }

    private Specification<Profile> buildFilter(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            String pattern = "%" + q.trim().toLowerCase() + "%";
            List<Predicate> matches = new ArrayList<>();
            matches.add(cb.like(cb.lower(root.get("name")), pattern));
            matches.add(cb.like(cb.lower(root.get("email")), pattern));
            matches.add(cb.like(cb.lower(root.get("phone")), pattern));
            return cb.or(matches.toArray(new Predicate[0]));
        };
    }

    public CustomerDetailDto getCustomerDetail(String id) {
        Profile profile = profileRepository.findById(Ids.parse(id, "Customer"))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        List<AddressDto> addresses = addressRepository.findByUserId(id).stream()
                .map(AddressDto::from)
                .collect(Collectors.toList());
        return new CustomerDetailDto(CustomerDto.from(profile), addresses);
    }

    public List<OrderDto> getCustomerOrders(String id) {
        // Find orders by user_id if added, or by delivery address matching - but for now, return empty or filter
        // Based on schema, we have user_id on orders (added in migration V2)
        return orderRepository.findAll().stream()
                .filter(o -> id.equals(o.getUserId()))
                .map(OrderDto::from)
                .collect(Collectors.toList());
    }

    public List<FavoriteDto> getCustomerFavorites(String id) {
        return favoriteRepository.findByUserId(id).stream()
                .map(FavoriteDto::from)
                .collect(Collectors.toList());
    }
}
