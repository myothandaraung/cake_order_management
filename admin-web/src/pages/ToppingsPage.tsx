import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { toppingsService } from '@/lib/services'
import { Topping } from '@/types'
import { formatCurrency } from '@/lib/format'
import CatalogCrudPage from '@/components/ui/CatalogCrudPage'

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchToppings = async () => {
    setLoading(true)
    try {
      const res = await toppingsService.getAll()
      setToppings(Array.isArray(res.data) ? res.data : [])
      setError('')
    } catch (e) {
      setError('We could not load toppings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchToppings()
  }, [])

  return (
    <CatalogCrudPage<Topping>
      overline="Catalog"
      title="Toppings"
      description="Finishing touches added at checkout — fruit, florals, gold leaf and more."
      singular="Topping"
      addLabel="Add topping"
      rows={toppings}
      loading={loading}
      error={error}
      columns={[
        {
          label: 'Topping',
          render: (topping) => (
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{topping.name}</Typography>
          ),
        },
        {
          label: 'Extra price',
          align: 'right',
          render: (topping) => (
            <Typography sx={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(topping.extraPrice)}
            </Typography>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true, placeholder: 'Fresh berries' },
        { name: 'extraPrice', label: 'Extra price (USD)', type: 'number', placeholder: '150' },
      ]}
      initialValues={{ name: '', extraPrice: 0 }}
      toValues={(topping) => ({ name: topping.name, extraPrice: topping.extraPrice ?? 0 })}
      onCreate={async (values) => {
        await toppingsService.create({
          name: String(values.name),
          extraPrice: Number(values.extraPrice) || 0,
        })
      }}
      onUpdate={async (topping, values) => {
        await toppingsService.update(topping.id, {
          name: String(values.name),
          extraPrice: Number(values.extraPrice) || 0,
        })
      }}
      onDelete={async (topping) => {
        await toppingsService.delete(topping.id)
      }}
      onReload={fetchToppings}
      emptyDescription="Add the finishing touches customers can choose at checkout."
    />
  )
}
