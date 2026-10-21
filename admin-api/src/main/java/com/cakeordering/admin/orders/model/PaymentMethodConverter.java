package com.cakeordering.admin.orders.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Reads legacy/unknown payment methods as {@link PaymentMethod#other} so a
 * single unexpected row cannot break the whole orders listing.
 */
@Converter
public class PaymentMethodConverter implements AttributeConverter<PaymentMethod, String> {

    @Override
    public String convertToDatabaseColumn(PaymentMethod attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public PaymentMethod convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        String normalized = dbData.trim().toLowerCase().replace('-', '_').replace(' ', '_');
        for (PaymentMethod method : PaymentMethod.values()) {
            if (method.name().equals(normalized)) {
                return method;
            }
        }
        return PaymentMethod.other;
    }
}
