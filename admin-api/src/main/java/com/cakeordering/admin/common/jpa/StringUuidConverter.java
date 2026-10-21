package com.cakeordering.admin.common.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.UUID;

/**
 * Stores UUID columns (Postgres {@code uuid}) in {@code String} entity fields.
 *
 * <p>The shared Supabase schema uses {@code uuid} primary and foreign keys while
 * the admin API exposes string identifiers. Without this converter Hibernate
 * binds the value as {@code varchar} and Postgres rejects the comparison or
 * insert with "operator does not exist: uuid = character varying".</p>
 */
@Converter
public class StringUuidConverter implements AttributeConverter<String, UUID> {

    @Override
    public UUID convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return null;
        }
        return UUID.fromString(attribute.trim());
    }

    @Override
    public String convertToEntityAttribute(UUID dbData) {
        return dbData == null ? null : dbData.toString();
    }
}
