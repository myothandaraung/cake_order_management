import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { customersService } from '@/lib/services'
import { Address, Customer, Favorite, Order } from '@/types'
import { formatCurrency, formatDate, formatDateTime, initials } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ py: 1.25 }}>
      <Typography
        variant="overline"
        sx={{ fontSize: '0.56rem', letterSpacing: '0.18em', color: 'text.disabled', display: 'block' }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.35, fontSize: '0.85rem', wordBreak: 'break-word' }}>{value}</Typography>
    </Box>
  )
}

function formatAddress(address: Address): string {
  return [address.street, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ')
}

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Customer | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!id) return
      setLoading(true)
      const [detail, customerOrders, customerFavorites] = await Promise.allSettled([
        customersService.get(id),
        customersService.getOrders(id),
        customersService.getFavorites(id),
      ])

      if (!active) return

      if (detail.status === 'fulfilled') {
        setProfile(detail.value.data?.profile ?? null)
        setAddresses(detail.value.data?.addresses ?? [])
      } else {
        setError('We could not load this customer.')
      }
      if (customerOrders.status === 'fulfilled') {
        setOrders(Array.isArray(customerOrders.value.data) ? customerOrders.value.data : [])
      }
      if (customerFavorites.status === 'fulfilled') {
        setFavorites(Array.isArray(customerFavorites.value.data) ? customerFavorites.value.data : [])
      }
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={44} />
        <Skeleton variant="rounded" height={240} sx={{ mt: 3, borderRadius: '18px' }} />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box>
        <Alert severity="error">{error || 'Customer not found.'}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/customers')}>
          Back to customers
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        size="small"
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
        onClick={() => navigate('/customers')}
        sx={{ mb: 2, ml: -1 }}
      >
        All customers
      </Button>

      <PageHeader
        overline="Customer"
        title={profile.name || 'Unnamed customer'}
        description={`Joined ${formatDate(profile.createdAt)} · ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.85fr 1.6fr' }, gap: 2.5, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Panel title="Profile" subtitle="Contact details on file">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, pb: 1.5 }}>
              <Avatar
                src={profile.avatarUrl || undefined}
                sx={{
                  width: 52,
                  height: 52,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'primary.main',
                  backgroundColor: '#F3E3E1',
                }}
              >
                {initials(profile.name, 'C')}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  {profile.name || '—'}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>
                  {profile.email || '—'}
                </Typography>
              </Box>
            </Box>
            <DetailRow label="Phone" value={profile.phone || '—'} />
            <DetailRow label="Email" value={profile.email || '—'} />
            <DetailRow
              label="Customer ID"
              value={<Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.76rem' }}>{profile.id}</Box>}
            />
          </Panel>

          <Panel title="Addresses" subtitle={`${addresses.length} saved`}>
            {addresses.length === 0 ? (
              <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary' }}>
                No addresses saved yet.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {addresses.map((address) => (
                  <Box key={address.id} sx={{ display: 'flex', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '9px',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        backgroundColor: 'rgba(194, 164, 122, 0.14)',
                        color: '#8A6F42',
                      }}
                    >
                      <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {address.label || 'Address'}
                        {address.isDefault && (
                          <Box
                            component="span"
                            sx={{
                              ml: 1,
                              px: 0.75,
                              py: 0.1,
                              borderRadius: '999px',
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              backgroundColor: '#E4EDE6',
                              color: '#2F4B38',
                            }}
                          >
                            Default
                          </Box>
                        )}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5 }}>
                        {formatAddress(address) || '—'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Panel>
        </Box>

        <Panel title="History" subtitle="Orders and saved cakes" flush>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: { xs: 2, md: 3 } }}>
            <Tab label={`Orders (${orders.length})`} />
            <Tab label={`Favourites (${favorites.length})`} />
          </Tabs>

          {tab === 0 &&
            (orders.length === 0 ? (
              <EmptyState title="No orders yet" description="This customer has not placed an order." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Placed</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <TableCell>
                          <Typography sx={{ fontSize: '0.86rem', fontWeight: 600 }}>
                            #{order.orderNumber}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                            {order.deliveryAddress || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={order.status} size="small" />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrency(order.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}

          {tab === 1 &&
            (favorites.length === 0 ? (
              <EmptyState
                icon={<CakeOutlinedIcon />}
                title="No favourites yet"
                description="Cakes this customer saves will appear here."
              />
            ) : (
              <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
                {favorites.map((favorite, index) => (
                  <Box
                    key={favorite.id ?? index}
                    onClick={() => favorite.cakeId && navigate(`/cakes/${favorite.cakeId}`)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.4,
                      mx: -1,
                      px: 1,
                      borderRadius: '10px',
                      cursor: favorite.cakeId ? 'pointer' : 'default',
                      borderBottom: (t) =>
                        index === favorites.length - 1 ? 'none' : `1px solid ${t.palette.divider}`,
                      '&:hover': favorite.cakeId
                        ? { backgroundColor: 'rgba(243, 227, 225, 0.42)' }
                        : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: 'rgba(194, 164, 122, 0.14)',
                        color: '#8A6F42',
                      }}
                    >
                      <CakeOutlinedIcon sx={{ fontSize: 17 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Saved cake</Typography>
                      <Typography noWrap sx={{ fontSize: '0.72rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                        {favorite.cakeId ? favorite.cakeId.slice(0, 13) : '—'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
        </Panel>
      </Box>
    </Box>
  )
}
