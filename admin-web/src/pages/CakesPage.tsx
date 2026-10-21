import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
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
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import { cakesService, categoriesService } from '@/lib/services'
import { Cake, Category } from '@/types'
import { formatCurrency, humanize } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import EmptyState from '@/components/ui/EmptyState'

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    categoriesService
      .getAll()
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => undefined)
  }, [])

  const fetchCakes = async () => {
    setLoading(true)
    try {
      const res = await cakesService.getAll({
        size: 50,
        ...(query ? { q: query } : {}),
        ...(category ? { categoryId: category } : {}),
      })
      setCakes(res.data?.items ?? [])
      setError('')
    } catch (e) {
      setError('We could not load the cake catalogue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchCakes, query ? 300 : 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category])

  const handleDelete = async (cake: Cake) => {
    if (!window.confirm(`Delete “${cake.name}”?`)) return
    try {
      await cakesService.delete(cake.id)
      fetchCakes()
    } catch (e) {
      setError('The cake could not be deleted.')
    }
  }

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? '—'

  return (
    <Box>
      <PageHeader
        overline="Commerce"
        title="Cakes"
        description="The catalogue customers browse — prices, categories and the pieces you are proud of."
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />} onClick={() => navigate('/cakes/new')}>
            Add cake
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Panel
        title="Catalogue"
        subtitle={`${cakes.length} ${cakes.length === 1 ? 'cake' : 'cakes'}`}
        flush
        action={
          <Box sx={{ display: 'flex', gap: 1.25 }}>
            <TextField
              size="small"
              placeholder="Search cakes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ width: { xs: 150, sm: 210 }, display: { xs: 'none', sm: 'flex' } }}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 150, '& .MuiSelect-select': { paddingBlock: '9px' } }}
            >
              <MenuItem value="">All categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        }
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cake</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Category</TableCell>
                <TableCell>Flags</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right" sx={{ width: 96 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton variant="rounded" height={32} />
                    </TableCell>
                  </TableRow>
                ))
              ) : cakes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <EmptyState
                      icon={<CakeOutlinedIcon />}
                      title={query || category ? 'No cakes match' : 'No cakes yet'}
                      description={
                        query || category
                          ? 'Try another search, or clear the category filter.'
                          : 'Add your first cake to open the catalogue.'
                      }
                      action={
                        <Button variant="outlined" size="small" onClick={() => navigate('/cakes/new')}>
                          Add cake
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                cakes.map((cake) => (
                  <TableRow key={cake.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={cake.imageUrl || undefined}
                          variant="rounded"
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(194, 164, 122, 0.16)',
                            color: '#8A6F42',
                            flexShrink: 0,
                          }}
                        >
                          <CakeOutlinedIcon sx={{ fontSize: 19 }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.87rem', fontWeight: 600, color: 'text.primary' }}>
                            {cake.name}
                          </Typography>
                          <Typography
                            noWrap
                            sx={{ fontSize: '0.72rem', color: 'text.secondary', maxWidth: 280 }}
                          >
                            {cake.description || 'No description'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                        {categoryName(cake.categoryId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                        {cake.isPopular && (
                          <Box
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.2,
                              borderRadius: '999px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              backgroundColor: '#F3E3E1',
                              color: '#7A2E3E',
                            }}
                          >
                            Popular
                          </Box>
                        )}
                        {cake.isNewArrival && (
                          <Box
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.2,
                              borderRadius: '999px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              backgroundColor: '#E4EDE6',
                              color: '#2F4B38',
                            }}
                          >
                            New
                          </Box>
                        )}
                        {!cake.isPopular && !cake.isNewArrival && (
                          <Typography sx={{ fontSize: '0.74rem', color: 'text.disabled' }}>—</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '0.87rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(cake.price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
                        <Tooltip title="Edit cake" arrow>
                          <IconButton onClick={() => navigate(`/cakes/${cake.id}`)}>
                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete cake" arrow>
                          <IconButton
                            onClick={() => handleDelete(cake)}
                            sx={{ '&:hover': { color: 'error.main', backgroundColor: 'rgba(163, 58, 58, 0.08)' } }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
