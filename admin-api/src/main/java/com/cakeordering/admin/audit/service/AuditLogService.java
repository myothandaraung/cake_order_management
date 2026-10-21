package com.cakeordering.admin.audit.service;

import com.cakeordering.admin.audit.dto.AuditLogDto;
import com.cakeordering.admin.audit.model.AuditLog;
import com.cakeordering.admin.audit.repository.AuditLogRepository;
import com.cakeordering.admin.common.dto.PageResponse;
import com.cakeordering.admin.common.util.PaginationUtils;
import com.cakeordering.admin.users.model.AdminUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private static final Set<String> SORTABLE = Set.of("createdAt", "action", "entityType", "entityId");

    private final AuditLogRepository auditLogRepository;

    public PageResponse<AuditLogDto> getAuditLogs(int page, int size, String sortBy, String sortDir) {
        Sort sort = PaginationUtils.buildSort(sortBy, sortDir, SORTABLE, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AuditLog> auditLogs = auditLogRepository.findAll(pageable);
        return PageResponse.from(auditLogs.map(AuditLogDto::from));
    }

    public void log(AdminUser adminUser, String entityType, String entityId, String action, String diff) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAdminUser(adminUser);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setAction(action);
        auditLog.setDiff(diff);
        auditLogRepository.save(auditLog);
    }
}
