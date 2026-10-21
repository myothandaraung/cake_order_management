import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import { cakesService, categoriesService } from '@/lib/services'
import { Category } from '@/types'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: 'block',
        mb: 0.75,
        fontSize: '0.76rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        color: 'text.secondary',
      }}
    >
      {children}
    </Typography>
  )
}

export default function CakeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id && id !== 'new')

  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    categoryId: '',
    isPopular: false,
    isNewArrival: false,
    tags: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const catsRes = await categoriesService.getAll()
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : [])

        if (isEdit && id) {
          const cakeRes = await cakesService.get(id)
          const cake = cakeRes.data
          setForm({
            name: cake.name ?? '',
            description: cake.description ?? '',
            imageUrl: cake.imageUrl ?? '',
            price: cake.price ?? 0,
            categoryId: cake.categoryId ?? '',
            isPopular: Boolean(cake.isPopular),
            isNewArrival: Boolean(cake.isNewArrival),
            tags: cake.tags ?? '',
          })
        }
      } catch (e) {
        setError('We could not load this cake.')
      }
    }
    loadData()
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isEdit && id) {
        await cakesService.update(id, form)
      } else {
        await cakesService.create(form)
      }
      navigate('/cakes')
    } catch (e) {
      setError('The cake could not be saved. Please check the fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Button
        size="small"
        variant="text"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
        onClick={() => navigate('/cakes')}
        sx={{ mb: 2, ml: -1 }}
      >
        Catalogue
      </Button>

      <PageHeader
        overline="Catalogue"
        title={isEdit ? 'Edit cake' : 'New cake'}
        description={
          isEdit
            ? 'Refine the details customers see in the storefront.'
            : 'Add a new piece to the catalogue — you can always refine it later.'
        }
        actions={
          <>
            <Button variant="outlined" onClick={() => navigate('/cakes')}>
              Cancel
            </Button>
            <Button type="submit" form="cake-form" variant="contained" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create cake'}
            </Button>
          </>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box
        component="form"
        id="cake-form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 2.5, alignItems: 'start' }}
      >
        <Panel title="Cake details" subtitle="The essentials of the product">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <Box>
              <FieldLabel htmlFor="cake-name">Name</FieldLabel>
              <TextField
                id="cake-name"
                fullWidth
                required
                placeholder="Raspberry rose celebration cake"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Box>

            <Box>
              <FieldLabel htmlFor="cake-description">Description</FieldLabel>
              <TextField
                id="cake-description"
                fullWidth
                multiline
                minRows={3}
                placeholder="What makes this cake special?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.25 }}>
              <Box>
                <FieldLabel htmlFor="cake-price">Price</FieldLabel>
                <TextField
                  id="cake-price"
                  fullWidth
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>$</Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <FieldLabel htmlFor="cake-category">Category</FieldLabel>
                <FormControl fullWidth required>
                  <Select
                    id="cake-category"
                    displayEmpty
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <MenuItem value="" disabled>
                      Choose a category
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box>
              <FieldLabel htmlFor="cake-tags">Tags</FieldLabel>
              <TextField
                id="cake-tags"
                fullWidth
                placeholder="chocolate, birthday, bestseller"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                helperText="Separate tags with commas."
              />
            </Box>

            <Box>
              <FieldLabel htmlFor="cake-image">Image URL</FieldLabel>
              <TextField
                id="cake-image"
                fullWidth
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </Box>
          </Box>
        </Panel>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Panel title="Preview" subtitle="How the cake appears in the grid">
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '4 / 3',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: 'rgba(194, 164, 122, 0.12)',
                border: (t) => `1px dashed ${t.palette.divider}`,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {form.imageUrl ? (
                <Box
                  component="img"
                  src={form.imageUrl}
                  alt={form.name || 'Cake preview'}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <Box sx={{ textAlign: 'center', color: '#9A7C4E', px: 2 }}>
                  <CakeOutlinedIcon sx={{ fontSize: 30, mb: 0.5 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Add an image URL to preview
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography sx={{ mt: 1.75, fontSize: '0.95rem', fontWeight: 600 }}>
              {form.name || 'Untitled cake'}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
              {form.price ? `$${form.price}` : 'Price not set'}
            </Typography>
          </Panel>

          <Panel title="Merchandising" subtitle="Where this cake is surfaced">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                sx={{ m: 0, justifyContent: 'space-between', width: '100%' }}
                labelPlacement="start"
                control={
                  <Switch
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: '0.84rem', fontWeight: 500 }}>Popular</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                      Show in the popular picks
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                sx={{ m: 0, justifyContent: 'space-between', width: '100%' }}
                labelPlacement="start"
                control={
                  <Switch
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: '0.84rem', fontWeight: 500 }}>New arrival</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                      Highlight as a new addition
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Panel>
        </Box>
      </Box>
    </Box>
  )
}
