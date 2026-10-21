import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { sizesService } from '@/lib/services'
import { CakeSize } from '@/types'
import { formatCurrency } from '@/lib/format'
import CatalogCrudPage from '@/components/ui/CatalogCrudPage'

export default function SizesPage() {
  const [sizes, setSizes] = useState<CakeSize[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSizes = async () => {
    setLoading(true)
    try {
      const res = await sizesService.getAll()
      setSizes(Array.isArray(res.data) ? res.data : [])
      setError('')
    } catch (e) {
      setError('We could not load cake sizes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSizes()
  }, [])

  return (
    <CatalogCrudPage<CakeSize>
      overline="Catalog"
      title="Sizes"
      description="The tiers a cake can be ordered in, with the extra charge each one carries."
      singular="Size"
      addLabel="Add size"
      rows={sizes}
      loading={loading}
      error={error}
      columns={[
        {
          label: 'Size',
          render: (size) => (
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{size.label}</Typography>
          ),
        },
        {
          label: 'Extra price',
          align: 'right',
          render: (size) => (
            <Typography sx={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(size.extraPrice)}
            </Typography>
          ),
        },
        {
          label: 'Base price',
          align: 'right',
          render: (size) => (
            <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {size.basePrice ? formatCurrency(size.basePrice) : '—'}
            </Typography>
          ),
        },
      ]}
      fields={[
        { name: 'label', label: 'Label', required: true, placeholder: '6 inch' },
        { name: 'extraPrice', label: 'Extra price (USD)', type: 'number', placeholder: '250' },
        { name: 'basePrice', label: 'Base price (USD)', type: 'number', placeholder: '1200' },
      ]}
      initialValues={{ label: '', extraPrice: 0, basePrice: 0 }}
      toValues={(size) => ({
        label: size.label,
        extraPrice: size.extraPrice ?? 0,
        basePrice: size.basePrice ?? 0,
      })}
      onCreate={async (values) => {
        await sizesService.create({
          label: String(values.label),
          extraPrice: Number(values.extraPrice) || 0,
          basePrice: Number(values.basePrice) || 0,
        })
      }}
      onUpdate={async (size, values) => {
        await sizesService.update(size.id, {
          label: String(values.label),
          extraPrice: Number(values.extraPrice) || 0,
          basePrice: Number(values.basePrice) || 0,
        })
      }}
      onDelete={async (size) => {
        await sizesService.delete(size.id)
      }}
      onReload={fetchSizes}
      emptyDescription="Add the sizes you offer, from 6 inch rounds to tiered celebration cakes."
    />
  )
}
