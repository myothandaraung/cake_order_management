package com.cakeordering.admin.audit.repository;

import com.cakeordering.admin.audit.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
}
