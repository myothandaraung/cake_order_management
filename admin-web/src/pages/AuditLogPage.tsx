import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { auditService } from '@/lib/services'
import { AuditLog } from '@/types'
import { formatDateTime, humanize, initials } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await auditService.getAll({ size: 100 })
        setLogs(res.data?.items ?? [])
      } catch (e) {
        setError('We could not load the audit log.')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <Box>
      <PageHeader
        overline="Administration"
        title="Audit log"
        description="A quiet record of every change made in the studio — who, what and when."
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Panel title="Activity" subtitle={`${logs.length} recent ${logs.length === 1 ? 'event' : 'events'}`} flush>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Who</TableCell>
                <TableCell>Action</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Entity</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton variant="rounded" height={26} />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <EmptyState
                      icon={<HistoryOutlinedIcon />}
                      title="No activity recorded"
                      description="Changes made by the team will be logged here."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.82rem' }}>
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'primary.main',
                            backgroundColor: '#F3E3E1',
                          }}
                        >
                          {initials(log.adminUserName, 'S')}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.83rem' }}>
                          {log.adminUserName || 'System'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={log.action} size="small" />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary', fontSize: '0.82rem' }}>
                      {humanize(log.entityType)}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                      <Tooltip title={log.entityId || ''} arrow>
                        <Box
                          component="span"
                          sx={{
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                            fontSize: '0.73rem',
                            color: 'text.disabled',
                            backgroundColor: 'rgba(35, 28, 31, 0.04)',
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                          }}
                        >
                          {log.entityId ? log.entityId.slice(0, 8) : '—'}
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>
    </Box>
  )
}
