package com.cakeordering.admin.orders.model;

import com.cakeordering.admin.common.jpa.StringUuidConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "order_item")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class OrderItem {
    @Id
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "cake_id")
    private String cakeId;

    @Column(name = "size_id")
    private Integer sizeId;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "flavor_id")
    private String flavorId;

    /** Not part of the shared order_item table yet. */
    @Transient
    private String toppingIds;

    /** Not part of the shared order_item table yet. */
    @Transient
    private String message;

    private Integer quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "line_total")
    private BigDecimal lineTotal;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
