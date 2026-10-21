package com.cakeordering.admin.orders.model;

/**
 * Values are stored in the orders table as plain text, so the constant names
 * double as the persisted and API values (snake_case to match the UI).
 */
public enum OrderStatus {
    pending,
    confirmed,
    processing,
    preparing,
    ready_for_pickup,
    out_for_delivery,
    delivered,
    cancelled,
    refunded,
    unknown
}
