import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { flavorsService } from '@/lib/services'
import { CakeFlavor } from '@/types'
import { formatCurrency } from '@/lib/format'
import CatalogCrudPage from '@/components/ui/CatalogCrudPage'

export default function FlavorsPage() {
  const [flavors, setFlavors] = useState<CakeFlavor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFlavors = async () => {
    setLoading(true)
    try {
      const res = await flavorsService.getAll()
      setFlavors(Array.isArray(res.data) ? res.data : [])
      setError('')
    } catch (e) {
      setError('We could not load flavors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlavors()
  }, [])

  return (
    <CatalogCrudPage<CakeFlavor>
      overline="Catalog"
      title="Flavors"
      description="Sponges and fillings customers can choose, and any premium they add."
      singular="Flavor"
      addLabel="Add flavor"
      rows={flavors}
      loading={loading}
      error={error}
      columns={[
        {
          label: 'Flavor',
          render: (flavor) => (
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{flavor.name}</Typography>
          ),
        },
        {
          label: 'Extra price',
          align: 'right',
          render: (flavor) => (
            <Typography sx={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(flavor.extraPrice)}
            </Typography>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true, placeholder: 'Red velvet' },
        { name: 'extraPrice', label: 'Extra price (USD)', type: 'number', placeholder: '0' },
      ]}
      initialValues={{ name: '', extraPrice: 0 }}
      toValues={(flavor) => ({ name: flavor.name, extraPrice: flavor.extraPrice ?? 0 })}
      onCreate={async (values) => {
        await flavorsService.create({
          name: String(values.name),
          extraPrice: Number(values.extraPrice) || 0,
        })
      }}
      onUpdate={async (flavor, values) => {
        await flavorsService.update(flavor.id, {
          name: String(values.name),
          extraPrice: Number(values.extraPrice) || 0,
        })
      }}
      onDelete={async (flavor) => {
        await flavorsService.delete(flavor.id)
      }}
      onReload={fetchFlavors}
      emptyDescription="Add the flavors your kitchen can bake, from vanilla bean to dark chocolate."
    />
  )
}
