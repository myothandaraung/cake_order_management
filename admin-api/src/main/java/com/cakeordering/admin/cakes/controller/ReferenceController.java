package com.cakeordering.admin.cakes.controller;

import com.cakeordering.admin.cakes.dto.*;
import com.cakeordering.admin.cakes.model.*;
import com.cakeordering.admin.cakes.repository.*;
import com.cakeordering.admin.common.util.Ids;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ReferenceController {
    private final CategoryRepository categoryRepository;
    private final CakeSizeRepository cakeSizeRepository;
    private final CakeFlavorRepository cakeFlavorRepository;
    private final ToppingRepository toppingRepository;

    // Categories
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll().stream().map(CategoryDto::from).collect(Collectors.toList()));
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody ReferenceRequest.CategoryRequest request) {
        Category category = new Category();
        // categories.id is a uuid column, slug is a separate readable identifier.
        category.setId(UUID.randomUUID());
        category.setName(request.name());
        category.setSlug(request.slug() != null ? request.slug() : slugify(request.name()));
        return ResponseEntity.ok(CategoryDto.from(categoryRepository.save(category)));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable String id, @Valid @RequestBody ReferenceRequest.CategoryRequest request) {
        Category category = categoryRepository.findById(Ids.parse(id, "Category")).orElseThrow(() -> new IllegalArgumentException("Category not found"));
        category.setName(request.name());
        if (request.slug() != null) category.setSlug(request.slug());
        return ResponseEntity.ok(CategoryDto.from(categoryRepository.save(category)));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        if (!categoryRepository.existsById(Ids.parse(id, "Category"))) {
            throw new IllegalArgumentException("Category not found");
        }
        categoryRepository.deleteById(Ids.parse(id, "Category"));
        return ResponseEntity.noContent().build();
    }

    // Cake Sizes
    @GetMapping("/cake-sizes")
    public ResponseEntity<List<CakeSizeDto>> getCakeSizes() {
        return ResponseEntity.ok(cakeSizeRepository.findAll().stream().map(CakeSizeDto::from).collect(Collectors.toList()));
    }

    @PostMapping("/cake-sizes")
    public ResponseEntity<CakeSizeDto> createCakeSize(@Valid @RequestBody ReferenceRequest.CakeSizeRequest request) {
        CakeSize size = new CakeSize();
        size.setLabel(request.label());
        size.setExtraPrice(zeroIfNull(request.extraPrice()));
        size.setBasePrice(zeroIfNull(request.basePrice()));
        return ResponseEntity.ok(CakeSizeDto.from(cakeSizeRepository.save(size)));
    }

    @PutMapping("/cake-sizes/{id}")
    public ResponseEntity<CakeSizeDto> updateCakeSize(@PathVariable Integer id, @Valid @RequestBody ReferenceRequest.CakeSizeRequest request) {
        CakeSize size = cakeSizeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Size not found"));
        size.setLabel(request.label());
        size.setExtraPrice(zeroIfNull(request.extraPrice()));
        size.setBasePrice(zeroIfNull(request.basePrice()));
        return ResponseEntity.ok(CakeSizeDto.from(cakeSizeRepository.save(size)));
    }

    @DeleteMapping("/cake-sizes/{id}")
    public ResponseEntity<Void> deleteCakeSize(@PathVariable Integer id) {
        if (!cakeSizeRepository.existsById(id)) {
            throw new IllegalArgumentException("Size not found");
        }
        cakeSizeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Cake Flavors
    @GetMapping("/cake-flavors")
    public ResponseEntity<List<CakeFlavorDto>> getCakeFlavors() {
        return ResponseEntity.ok(cakeFlavorRepository.findAll().stream().map(CakeFlavorDto::from).collect(Collectors.toList()));
    }

    @PostMapping("/cake-flavors")
    public ResponseEntity<CakeFlavorDto> createCakeFlavor(@Valid @RequestBody ReferenceRequest.CakeFlavorRequest request) {
        CakeFlavor flavor = new CakeFlavor();
        flavor.setId(UUID.randomUUID());
        flavor.setName(request.name());
        flavor.setExtraPrice(zeroIfNull(request.extraPrice()));
        flavor.setBasePrice(zeroIfNull(request.basePrice()));
        return ResponseEntity.ok(CakeFlavorDto.from(cakeFlavorRepository.save(flavor)));
    }

    @PutMapping("/cake-flavors/{id}")
    public ResponseEntity<CakeFlavorDto> updateCakeFlavor(@PathVariable String id, @Valid @RequestBody ReferenceRequest.CakeFlavorRequest request) {
        CakeFlavor flavor = cakeFlavorRepository.findById(Ids.parse(id, "Flavor")).orElseThrow(() -> new IllegalArgumentException("Flavor not found"));
        flavor.setName(request.name());
        flavor.setExtraPrice(zeroIfNull(request.extraPrice()));
        flavor.setBasePrice(zeroIfNull(request.basePrice()));
        return ResponseEntity.ok(CakeFlavorDto.from(cakeFlavorRepository.save(flavor)));
    }

    @DeleteMapping("/cake-flavors/{id}")
    public ResponseEntity<Void> deleteCakeFlavor(@PathVariable String id) {
        if (!cakeFlavorRepository.existsById(Ids.parse(id, "Flavor"))) {
            throw new IllegalArgumentException("Flavor not found");
        }
        cakeFlavorRepository.deleteById(Ids.parse(id, "Flavor"));
        return ResponseEntity.noContent().build();
    }

    // Toppings
    @GetMapping("/toppings")
    public ResponseEntity<List<ToppingDto>> getToppings() {
        return ResponseEntity.ok(toppingRepository.findAll().stream().map(ToppingDto::from).collect(Collectors.toList()));
    }

    @PostMapping("/toppings")
    public ResponseEntity<ToppingDto> createTopping(@Valid @RequestBody ReferenceRequest.ToppingRequest request) {
        Topping topping = new Topping();
        topping.setId(UUID.randomUUID().toString());
        topping.setName(request.name());
        topping.setExtraPrice(zeroIfNull(request.extraPrice()));
        return ResponseEntity.ok(ToppingDto.from(toppingRepository.save(topping)));
    }

    @PutMapping("/toppings/{id}")
    public ResponseEntity<ToppingDto> updateTopping(@PathVariable String id, @Valid @RequestBody ReferenceRequest.ToppingRequest request) {
        Topping topping = toppingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Topping not found"));
        topping.setName(request.name());
        topping.setExtraPrice(zeroIfNull(request.extraPrice()));
        return ResponseEntity.ok(ToppingDto.from(toppingRepository.save(topping)));
    }

    @DeleteMapping("/toppings/{id}")
    public ResponseEntity<Void> deleteTopping(@PathVariable String id) {
        if (!toppingRepository.existsById(id)) {
            throw new IllegalArgumentException("Topping not found");
        }
        toppingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private static BigDecimal zeroIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private static String slugify(String name) {
        return name.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-");
    }
}
