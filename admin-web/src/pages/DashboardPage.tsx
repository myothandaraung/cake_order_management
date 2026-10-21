import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { dashboardService } from '@/lib/services'
import { DashboardMetrics, Order } from '@/types'
import { formatCurrency, formatDateTime, formatNumber, humanize } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'

const pipelineColors: Record<string, string> = {
  pending: '#B7793A',
  confirmed: '#48606C',
  processing: '#7A2E3E',
  ready_for_pickup: '#4F6B57',
  out_for_delivery: '#3C7A5E',
  delivered: '#6F8C74',
  cancelled: '#A33A3A',
  refunded: '#9A8F91',
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

interface MetricCardProps {
  label: string
  value: string
  note: string
  icon: React.ReactNode
  featured?: boolean
}

function MetricCard({ label, value, note, icon, featured }: MetricCardProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '18px',
        border: featured ? '1px solid transparent' : (t) => `1px solid ${t.palette.divider}`,
        background: featured
          ? 'linear-gradient(150deg, #8B3A4B 0%, #6B2433 55%, #531C28 100%)'
          : 'background.paper',
        color: featured ? '#FBF2E8' : 'text.primary',
        p: 2.75,
        minHeight: 152,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: featured
            ? '0 22px 44px -26px rgba(92, 31, 44, 0.95)'
            : '0 20px 40px -30px rgba(35, 28, 31, 0.55)',
        },
        '&::after': featured
          ? {
              content: '""',
              position: 'absolute',
              width: 190,
              height: 190,
              right: -70,
              bottom: -105,
              borderRadius: '50%',
              border: '1px solid rgba(248, 233, 213, 0.22)',
            }
          : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            color: featured ? 'rgba(249, 239, 228, 0.66)' : 'text.disabled',
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: featured ? 'rgba(255,255,255,0.12)' : 'rgba(194, 164, 122, 0.14)',
            color: featured ? '#F3D9B4' : '#9A7C4E',
            '& svg': { fontSize: 17 },
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontFamily: (t) => t.typography.h1.fontFamily,
            fontSize: { xs: '1.9rem', md: '2.05rem' },
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: featured ? '#FDF6EE' : 'text.primary',
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            fontSize: '0.73rem',
            color: featured ? 'rgba(249, 239, 228, 0.62)' : 'text.secondary',
          }}
        >
          {note}
        </Typography>
      </Box>
    </Box>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [pipeline, setPipeline] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, recentRes, pipelineRes] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getRecentOrders(5),
          dashboardService.getOrdersByStatus(),
        ])
        setMetrics(metricsRes.data)
        setRecentOrders(Array.isArray(recentRes.data) ? recentRes.data : [])
        setPipeline(pipelineRes.data ?? {})
      } catch (e) {
        setError('We could not load the dashboard right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const pipelineEntries = Object.entries(pipeline)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
  const pipelineTotal = pipelineEntries.reduce((sum, [, count]) => sum + count, 0)

  return (
    <Box>
      <PageHeader
        overline="Overview"
        title={greeting()}
        description="A snapshot of the studio — revenue, orders and the busy days ahead."
        actions={
          <Button variant="outlined" endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />} onClick={() => navigate('/orders')}>
            All orders
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {loading || !metrics ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={152} sx={{ borderRadius: '18px' }} />
          ))
        ) : (
          <>
            <MetricCard
              featured
              label="Revenue"
              value={formatCurrency(metrics.revenue)}
              note="From delivered orders"
              icon={<PaidOutlinedIcon />}
            />
            <MetricCard
              label="Orders"
              value={formatNumber(metrics.orderCount)}
              note="All time"
              icon={<ReceiptLongOutlinedIcon />}
            />
            <MetricCard
              label="Avg. order value"
              value={formatCurrency(metrics.avgOrderValue)}
              note="Per order placed"
              icon={<TrendingUpRoundedIcon />}
            />
            <MetricCard
              label="New customers"
              value={formatNumber(metrics.newCustomers)}
              note="Registered accounts"
              icon={<PersonAddAltOutlinedIcon />}
            />
          </>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.55fr 1fr' }, gap: 2.5 }}>
        <Panel
          title="Recent orders"
          subtitle="The latest activity in the studio"
          action={
            <Button size="small" variant="text" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />} onClick={() => navigate('/orders')}>
              View all
            </Button>
          }
        >
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={52} />
              ))}
            </Box>
          ) : recentOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="New orders will appear here as soon as they come in."
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {recentOrders.map((order, index) => (
                <Box key={order.id}>
                  {index > 0 && <Divider />}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1.6,
                      px: 1,
                      mx: -1,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 140ms ease',
                      '&:hover': { backgroundColor: 'rgba(243, 227, 225, 0.42)' },
                    }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '11px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: 'rgba(194, 164, 122, 0.14)',
                        color: '#8A6F42',
                        fontFamily: (t) => t.typography.h2.fontFamily,
                        fontSize: '0.82rem',
                        flexShrink: 0,
                      }}
                    >
                      #{order.orderNumber}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary' }}>
                        {formatCurrency(order.total)}
                      </Typography>
                      <Typography noWrap sx={{ fontSize: '0.73rem', color: 'text.secondary' }}>
                        {formatDateTime(order.orderDate)}
                      </Typography>
                    </Box>
                    <StatusChip status={order.status} size="small" />
                    <Tooltip title="Open order" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/orders/${order.id}`)
                        }}
                      >
                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Panel>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Panel title="Order pipeline" subtitle="Where every order currently sits">
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={38} />
                ))}
              </Box>
            ) : pipelineEntries.length === 0 ? (
              <EmptyState title="Nothing in flight" description="Orders will show up here once they are placed." />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pipelineEntries.map(([status, count]) => {
                  const pct = pipelineTotal > 0 ? Math.round((count / pipelineTotal) * 100) : 0
                  return (
                    <Box key={status}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.primary', fontWeight: 500 }}>
                          {humanize(status)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                          {count} · {pct}%
                        </Typography>
                      </Box>
                      <Box sx={{ height: 6, borderRadius: 999, backgroundColor: 'rgba(35, 28, 31, 0.06)', overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${Math.max(pct, 3)}%`,
                            borderRadius: 999,
                            backgroundColor: pipelineColors[status] ?? '#9A8F91',
                            transition: 'width 400ms ease',
                          }}
                        />
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Panel>

          <Panel title="Quick actions" subtitle="Jump straight in">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[
                { label: 'Add a new cake', to: '/cakes/new' },
                { label: 'Browse customers', to: '/customers' },
                { label: 'Review the audit log', to: '/audit' },
              ].map((action) => (
                <Box
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.25,
                    px: 1,
                    mx: -1,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: 'text.primary',
                    fontSize: '0.84rem',
                    transition: 'background-color 140ms ease, color 140ms ease',
                    '&:hover': { backgroundColor: 'rgba(243, 227, 225, 0.42)', color: 'primary.main' },
                    '& svg': { fontSize: 16, color: 'text.disabled' },
                  }}
                >
                  {action.label}
                  <ArrowForwardRoundedIcon />
                </Box>
              ))}
            </Box>
          </Panel>
        </Box>
      </Box>
    </Box>
  )
}
