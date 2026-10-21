package com.cakeordering.admin.customers.model;

import com.cakeordering.admin.common.jpa.StringUuidConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "favorites")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Favorite {
    @Id
    private UUID id;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "user_id")
    private String userId;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "cake_id")
    private String cakeId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
