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
@Table(name = "addresses")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Address {
    @Id
    private UUID id;

    @Convert(converter = StringUuidConverter.class)
    @Column(name = "user_id")
    private String userId;

    @Column(name = "address_type")
    private String label;

    private String street;
    private String city;
    private String state;

    @Column(name = "zip_code")
    private String postalCode;

    private String country;

    /** The shared addresses table has no default flag. */
    @Transient
    private Boolean isDefault;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
