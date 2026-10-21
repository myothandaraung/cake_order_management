package com.cakeordering.admin.cakes.controller;

import com.cakeordering.admin.cakes.dto.*;
import com.cakeordering.admin.cakes.service.CakesService;
import com.cakeordering.admin.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cakes")
@RequiredArgsConstructor
public class CakesController {
    private final CakesService cakesService;

    @GetMapping
    public ResponseEntity<PageResponse<CakeDto>> getCakes(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Boolean isPopular,
            @RequestParam(required = false) Boolean isNewArrival,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(cakesService.getCakes(categoryId, isPopular, isNewArrival, q, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CakeDto> getCake(@PathVariable String id) {
        return ResponseEntity.ok(cakesService.getCake(id));
    }

    @PostMapping
    public ResponseEntity<CakeDto> createCake(@Valid @RequestBody CreateCakeRequest request) {
        return ResponseEntity.ok(cakesService.createCake(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CakeDto> updateCake(@PathVariable String id, @Valid @RequestBody UpdateCakeRequest request) {
        return ResponseEntity.ok(cakesService.updateCake(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable String id) {
        cakesService.deleteCake(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/flags")
    public ResponseEntity<CakeDto> updateFlags(@PathVariable String id, @RequestBody UpdateCakeFlagsRequest request) {
        return ResponseEntity.ok(cakesService.updateFlags(id, request.isPopular(), request.isNewArrival()));
    }
}
