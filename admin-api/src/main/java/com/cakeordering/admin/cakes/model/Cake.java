package com.cakeordering.admin.cakes.model;

import com.cakeordering.admin.common.jpa.StringUuidConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;
import java.util.List;

@Data
@Entity
@Table(name = "cakes")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cake {
    @Id
    private UUID id;

    private String name;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private BigDecimal price;

    /** The shared cakes.rating column is a whole number of stars. */
    private Integer rating;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "category_id")
    private String categoryId;

    @Column(name = "is_popular")
    private Boolean isPopular;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tags", columnDefinition = "jsonb")
    private List<String> tags = new ArrayList<>();

    @Column(name = "is_archived")
    private Boolean isArchived = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
