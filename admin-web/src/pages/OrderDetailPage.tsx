import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { ordersService } from '@/lib/services'
import { Order } from '@/types'
import { formatCurrency, formatDate, formatDateTime, humanize } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
]

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ py: 1.4 }}>
      <Typography
        variant="overline"
        sx={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'text.disabled', display: 'block' }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.4, fontSize: '0.88rem', color: 'text.primary' }}>{value}</Typography>
    </Box>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const res = await ordersService.get(id)
      setOrder(res.data)
      setStatus(res.data.status)
    } catch (e) {
      setError('We could not load this order.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusUpdate = async () => {
    if (!id) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const res = await ordersService.updateStatus(id, { status, ...(reason ? { reason } : {}) })
      setOrder(res.data)
      setReason('')
      setNotice('Order status updated.')
    } catch (e) {
      setError('The status could not be updated.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!id) return
    if (!window.confirm('Cancel this order? This cannot be undone from the admin panel.')) return
    setSaving(true)
    try {
      const res = await ordersService.cancel(id, 'Cancelled by admin')
      setOrder(res.data)
      setStatus(res.data.status)
      setNotice('Order cancelled.')
    } catch (e) {
      setError('The order could not be cancelled.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={220} height={44} />
        <Skeleton variant="rounded" height={280} sx={{ mt: 3, borderRadius: '18px' }} />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box>
        <Alert severity="error">{error || 'Order not found.'}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/orders')}>
          Back to orders
        </Button>
      </Box>
    )
  }

  const items = order.items ?? []

  return (
    <Box>
      <Button
        size="small"
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 2, ml: -1 }}
      >
        All orders
      </Button>

      <PageHeader
        overline="Order detail"
        title={`Order #${order.orderNumber}`}
        description={`Placed ${formatDateTime(order.orderDate)} · ${humanize(order.paymentMethod)}`}
        actions={<StatusChip status={order.status} />}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {notice && (
        <Alert
          severity="success"
          icon={<CheckRoundedIcon fontSize="inherit" />}
          onClose={() => setNotice('')}
          sx={{ mb: 3 }}
        >
          {notice}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 0 }}>
          <Panel title="Order summary" subtitle="What was ordered and where it is going">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, columnGap: 3 }}>
              <DetailRow label="Delivery date" value={formatDate(order.deliveryDate)} />
              <DetailRow label="Payment" value={humanize(order.paymentMethod)} />
              <DetailRow label="Updated" value={formatDateTime(order.updatedAt)} />
              <DetailRow label="Subtotal" value={formatCurrency(order.subtotal)} />
              <DetailRow label="Delivery fee" value={formatCurrency(order.deliveryFee)} />
              <DetailRow
                label="Total"
                value={
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: (t) => t.typography.h4.fontFamily,
                      fontSize: '1.15rem',
                      color: 'primary.main',
                    }}
                  >
                    {formatCurrency(order.total)}
                  </Typography>
                }
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <DetailRow label="Delivery address" value={order.deliveryAddress || '—'} />
          </Panel>

          <Panel
            title="Line items"
            subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} in this order`}
            flush
          >
            {items.length === 0 ? (
              <Box sx={{ px: 3, py: 4 }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                  No line items are attached to this order.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Unit price</TableCell>
                      <TableCell align="right">Line total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item: any, index: number) => (
                      <TableRow key={item.id ?? index}>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                            Custom cake
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                            {item.message ? `“${item.message}”` : 'Made to order'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ color: 'text.secondary' }}>
                          {item.quantity ?? 1}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Panel>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Panel title="Update status" subtitle="Move the order through the pipeline">
            <Typography
              variant="overline"
              sx={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'text.disabled', display: 'block', mb: 0.75 }}
            >
              New status
            </Typography>
            <Select fullWidth size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {humanize(option)}
                </MenuItem>
              ))}
            </Select>

            <Typography
              variant="overline"
              sx={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'text.disabled', display: 'block', mt: 2.5, mb: 0.75 }}
            >
              Note <Box component="span" sx={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</Box>
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder="Why is the status changing?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2.5 }}
              disabled={saving || status === order.status}
              onClick={handleStatusUpdate}
            >
              {saving ? 'Saving…' : status === order.status ? 'No changes yet' : 'Update status'}
            </Button>

            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <Button
                fullWidth
                variant="text"
                onClick={handleCancel}
                disabled={saving}
                sx={{ mt: 1, color: 'error.main', '&:hover': { backgroundColor: 'rgba(163, 58, 58, 0.07)', color: 'error.dark' } }}
              >
                Cancel order
              </Button>
            )}
          </Panel>

          <Panel title="Reference" subtitle="Useful when speaking with the customer">
            <DetailRow label="Order ID" value={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all' }}>{order.id}</Box>} />
            <DetailRow label="Customer ID" value={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all' }}>{order.userId || '—'}</Box>} />
          </Panel>
        </Box>
      </Box>
    </Box>
  )
}
