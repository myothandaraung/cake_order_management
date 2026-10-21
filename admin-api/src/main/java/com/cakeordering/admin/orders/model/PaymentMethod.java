package com.cakeordering.admin.orders.model;

/**
 * Values are stored as lowercase text. {@link #other} keeps rows written by
 * other clients (or future methods) loadable instead of failing the request.
 */
public enum PaymentMethod {
    cod,
    gcash,
    card,
    bank_transfer,
    paymaya,
    other
}
