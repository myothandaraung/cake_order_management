package com.cakeordering.admin.cakes.model;

import com.cakeordering.admin.common.jpa.StringUuidConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "cake_flavors")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CakeFlavor {
    @Id
    private UUID id;

    private String name;

    @Column(name = "extra_price")
    private BigDecimal extraPrice;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
