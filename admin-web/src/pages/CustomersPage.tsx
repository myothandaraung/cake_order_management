import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
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
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { customersService } from '@/lib/services'
import { Customer } from '@/types'
import { formatDate, initials } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import EmptyState from '@/components/ui/EmptyState'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const res = await customersService.getAll({ size: 50, ...(query ? { q: query } : {}) })
        if (!active) return
        setCustomers(res.data?.items ?? [])
        setError('')
      } catch (e) {
        if (active) setError('We could not load customers.')
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = setTimeout(fetchCustomers, query ? 300 : 0)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query])

  return (
    <Box>
      <PageHeader
        overline="Commerce"
        title="Customers"
        description="The people you bake for — their details, orders and favourite cakes."
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Panel
        title="Directory"
        subtitle={`${customers.length} ${customers.length === 1 ? 'customer' : 'customers'}`}
        flush
        action={
          <TextField
            size="small"
            placeholder="Search customers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: { xs: 150, sm: 220 }, display: { xs: 'none', sm: 'flex' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: { '& input': { paddingBlock: '9px' } },
            }}
          />
        }
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Phone</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Joined</TableCell>
                <TableCell align="right" sx={{ width: 72 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <Skeleton variant="rounded" height={30} />
                    </TableCell>
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: 0 }}>
                    <EmptyState
                      icon={<PersonOutlineRoundedIcon />}
                      title={query ? 'No matching customers' : 'No customers yet'}
                      description={
                        query
                          ? 'Try a different name or email.'
                          : 'Customers appear here after they create an account in the storefront.'
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={customer.avatarUrl || undefined}
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'primary.main',
                            backgroundColor: '#F3E3E1',
                          }}
                        >
                          {initials(customer.name, 'C')}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.87rem', fontWeight: 600 }}>
                            {customer.name || 'Unnamed customer'}
                          </Typography>
                          <Typography noWrap sx={{ fontSize: '0.73rem', color: 'text.secondary' }}>
                            {customer.email || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary', fontSize: '0.82rem' }}>
                      {customer.phone || '—'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary', fontSize: '0.82rem' }}>
                      {formatDate(customer.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View customer" arrow>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/customers/${customer.id}`)
                          }}
                        >
                          <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
                        </IconButton>
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
