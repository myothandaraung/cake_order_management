package com.cakeordering.admin.cakes.service;

import com.cakeordering.admin.cakes.dto.CakeDto;
import com.cakeordering.admin.cakes.dto.CreateCakeRequest;
import com.cakeordering.admin.cakes.dto.UpdateCakeRequest;
import com.cakeordering.admin.cakes.model.Cake;
import com.cakeordering.admin.cakes.repository.CakeRepository;
import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.common.util.Ids;
import com.cakeordering.admin.common.util.PaginationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CakesService {
    private static final Set<String> SORTABLE = Set.of("createdAt", "updatedAt", "name", "price", "rating");

    private final CakeRepository cakeRepository;

    public PageResponse<CakeDto> getCakes(String categoryId, Boolean isPopular, Boolean isNewArrival, String q,
                                        int page, int size, String sortBy, String sortDir) {
        Sort sort = PaginationUtils.buildSort(sortBy, sortDir, SORTABLE, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Cake> cakes = cakeRepository.findAll(buildFilter(categoryId, isPopular, isNewArrival, q), pageable);
        return PageResponse.from(cakes.map(CakeDto::from));
    }

    private Specification<Cake> buildFilter(String categoryId, Boolean isPopular, Boolean isNewArrival, String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.or(cb.isFalse(root.get("isArchived")), cb.isNull(root.get("isArchived"))));
            if (categoryId != null && !categoryId.isBlank()) {
                predicates.add(cb.equal(root.get("categoryId"), categoryId));
            }
            if (isPopular != null) {
                predicates.add(cb.equal(root.get("isPopular"), isPopular));
            }
            if (isNewArrival != null) {
                predicates.add(cb.equal(root.get("isNewArrival"), isNewArrival));
            }
            if (q != null && !q.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + q.trim().toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public CakeDto getCake(String id) {
        Cake cake = cakeRepository.findById(Ids.parse(id, "Cake"))
                .orElseThrow(() -> new IllegalArgumentException("Cake not found"));
        return CakeDto.from(cake);
    }

    @Transactional
    public CakeDto createCake(CreateCakeRequest request) {
        Cake cake = new Cake();
        cake.setId(UUID.randomUUID());
        cake.setName(request.name());
        cake.setDescription(request.description());
        cake.setImageUrl(request.imageUrl());
        cake.setPrice(request.price());
        cake.setRating(request.rating() != null ? Math.round(request.rating()) : 0);
        cake.setCategoryId(blankToNull(request.categoryId()));
        cake.setIsPopular(request.isPopular() != null ? request.isPopular() : false);
        cake.setIsNewArrival(request.isNewArrival() != null ? request.isNewArrival() : false);
        cake.setTags(parseTags(request.tags()));
        cake.setIsArchived(false);
        // Flush so the generated timestamps are present in the response.
        cake = cakeRepository.saveAndFlush(cake);
        return CakeDto.from(cake);
    }

    @Transactional
    public CakeDto updateCake(String id, UpdateCakeRequest request) {
        Cake cake = cakeRepository.findById(Ids.parse(id, "Cake"))
                .orElseThrow(() -> new IllegalArgumentException("Cake not found"));
        if (request.name() != null) cake.setName(request.name());
        if (request.description() != null) cake.setDescription(request.description());
        if (request.imageUrl() != null) cake.setImageUrl(request.imageUrl());
        if (request.price() != null) cake.setPrice(request.price());
        if (request.rating() != null) cake.setRating(Math.round(request.rating()));
        if (request.categoryId() != null) cake.setCategoryId(blankToNull(request.categoryId()));
        if (request.isPopular() != null) cake.setIsPopular(request.isPopular());
        if (request.isNewArrival() != null) cake.setIsNewArrival(request.isNewArrival());
        if (request.tags() != null) cake.setTags(parseTags(request.tags()));
        cake = cakeRepository.save(cake);
        return CakeDto.from(cake);
    }

    @Transactional
    public void deleteCake(String id) {
        Cake cake = cakeRepository.findById(Ids.parse(id, "Cake"))
                .orElseThrow(() -> new IllegalArgumentException("Cake not found"));
        cake.setIsArchived(true);
        cakeRepository.save(cake);
    }

    @Transactional
    public CakeDto updateFlags(String id, Boolean isPopular, Boolean isNewArrival) {
        Cake cake = cakeRepository.findById(Ids.parse(id, "Cake"))
                .orElseThrow(() -> new IllegalArgumentException("Cake not found"));
        if (isPopular != null) cake.setIsPopular(isPopular);
        if (isNewArrival != null) cake.setIsNewArrival(isNewArrival);
        cake = cakeRepository.save(cake);
        return CakeDto.from(cake);
    }

    /** Accepts "chocolate, popular" (the admin UI format) and stores a JSON array. */
    private static List<String> parseTags(String raw) {
        if (raw == null || raw.isBlank()) {
            return new ArrayList<>();
        }
        List<String> tags = Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .toList();
        return new ArrayList<>(tags);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
