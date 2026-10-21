import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { categoriesService } from '@/lib/services'
import { Category } from '@/types'
import CatalogCrudPage from '@/components/ui/CatalogCrudPage'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await categoriesService.getAll()
      setCategories(Array.isArray(res.data) ? res.data : [])
      setError('')
    } catch (e) {
      setError('We could not load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CatalogCrudPage<Category>
      overline="Catalog"
      title="Categories"
      description="The collections your cakes are filed under — the first thing customers browse."
      singular="Category"
      rows={categories}
      loading={loading}
      error={error}
      columns={[
        {
          label: 'Name',
          render: (category) => (
            <Box>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{category.name}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                {category.slug ? `/${category.slug}` : 'No slug set'}
              </Typography>
            </Box>
          ),
        },
        {
          label: 'Slug',
          render: (category) => (
            <Box
              component="span"
              sx={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '0.76rem',
                color: 'text.secondary',
                backgroundColor: 'rgba(35, 28, 31, 0.04)',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
              }}
            >
              {category.slug || '—'}
            </Box>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true, placeholder: 'Birthday cakes' },
        { name: 'slug', label: 'Slug', placeholder: 'birthday-cakes', hint: 'Used in storefront URLs.' },
      ]}
      initialValues={{ name: '', slug: '' }}
      toValues={(category) => ({ name: category.name, slug: category.slug })}
      onCreate={async (values) => {
        await categoriesService.create({ name: String(values.name), slug: String(values.slug) })
      }}
      onUpdate={async (category, values) => {
        await categoriesService.update(category.id, {
          name: String(values.name),
          slug: String(values.slug),
        })
      }}
      onDelete={async (category) => {
        await categoriesService.delete(category.id)
      }}
      onReload={fetchCategories}
      emptyDescription="Create a collection such as Birthday, Wedding or Cupcakes."
    />
  )
}
