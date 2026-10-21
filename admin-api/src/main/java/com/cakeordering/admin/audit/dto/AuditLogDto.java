package com.cakeordering.admin.audit.dto;

import com.cakeordering.admin.audit.model.AuditLog;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditLogDto(
    UUID id,
    UUID adminUserId,
    String adminUserName,
    String entityType,
    String entityId,
    String action,
    LocalDateTime createdAt
) {
    public static AuditLogDto from(AuditLog auditLog) {
        return new AuditLogDto(
            auditLog.getId(),
            auditLog.getAdminUser() != null ? auditLog.getAdminUser().getId() : null,
            auditLog.getAdminUser() != null ? auditLog.getAdminUser().getName() : null,
            auditLog.getEntityType(),
            auditLog.getEntityId(),
            auditLog.getAction(),
            auditLog.getCreatedAt()
        );
    }
}
