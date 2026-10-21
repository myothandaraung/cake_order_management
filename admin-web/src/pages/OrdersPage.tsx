import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { ordersService } from '@/lib/services'
import { Order } from '@/types'
import { formatCurrency, formatDate, formatDateTime, humanize } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    let active = true
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await ordersService.getAll({
          size: 50,
          ...(query ? { q: query } : {}),
          ...(status ? { status } : {}),
        })
        if (!active) return
        setOrders(res.data?.items ?? [])
        setError('')
      } catch (e) {
        if (active) setError('We could not load orders. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(fetchOrders, query ? 300 : 0)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, status])

  const emptyState = (
    <EmptyState
      icon={<ReceiptLongOutlinedIcon />}
      title={query || status ? 'No matching orders' : 'No orders yet'}
      description={
        query || status
          ? 'Try a different search term or clear the status filter.'
          : 'Orders placed in the storefront will appear here.'
      }
    />
  )

  return (
    <Box>
      <PageHeader
        overline="Commerce"
        title="Orders"
        description="Every celebration in progress — review, update and track each order."
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1.25, mb: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search orders"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: { '& input': { paddingBlock: '9px' } },
          }}
        />
        <Select
          size="small"
          displayEmpty
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 118, '& .MuiSelect-select': { paddingBlock: '9px' } }}
        >
          <MenuItem value="">All</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {humanize(option)}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Panel
        title="All orders"
        subtitle={`${orders.length} ${orders.length === 1 ? 'order' : 'orders'}${status ? ` · ${humanize(status)}` : ''}`}
        flush
        action={
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.25, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search orders"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ width: 210 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                sx: { '& input': { paddingBlock: '9px' } },
              }}
            />
            <Select
              size="small"
              displayEmpty
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ minWidth: 150, '& .MuiSelect-select': { paddingBlock: '9px' } }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {humanize(option)}
                </MenuItem>
              ))}
            </Select>
          </Box>
        }
      >
        {isCompact ? (
          loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={64} />
              ))}
            </Box>
          ) : orders.length === 0 ? (
            emptyState
          ) : (
            <Box>
              {orders.map((order) => (
                <Box
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2.25,
                    py: 1.75,
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    cursor: 'pointer',
                    '&:last-of-type': { borderBottom: 'none' },
                    '&:active': { backgroundColor: 'rgba(243, 227, 225, 0.5)' },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                      <Typography sx={{ fontSize: '0.86rem', fontWeight: 600 }}>
                        #{order.orderNumber}
                      </Typography>
                      <StatusChip status={order.status} size="small" />
                    </Box>
                    <Typography noWrap sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                      {formatDateTime(order.orderDate)}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>
                      {order.deliveryAddress || 'No address'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(order.total)}
                    </Typography>
                    <ArrowForwardRoundedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: 0.5 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Placed</TableCell>
                  <TableCell>Delivery</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right" sx={{ width: 64 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton variant="rounded" height={26} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      {emptyState}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: '10px',
                              display: 'grid',
                              placeItems: 'center',
                              backgroundColor: 'rgba(194, 164, 122, 0.14)',
                              color: '#8A6F42',
                              flexShrink: 0,
                            }}
                          >
                            <ReceiptLongOutlinedIcon sx={{ fontSize: 17 }} />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: 'text.primary' }}>
                              #{order.orderNumber}
                            </Typography>
                            <Typography noWrap sx={{ fontSize: '0.72rem', color: 'text.secondary', maxWidth: 240 }}>
                              {order.deliveryAddress || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {formatDateTime(order.orderDate)}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {formatDate(order.deliveryDate)}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                        {humanize(order.paymentMethod)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '0.87rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrency(order.total)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View order" arrow>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/orders/${order.id}`)
                            }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Panel>
    </Box>
  )
}
