import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import EmptyState from '@/components/ui/EmptyState'

export interface CatalogColumn<T> {
  label: string
  align?: 'left' | 'right' | 'center'
  width?: number | string
  render: (row: T, index: number) => React.ReactNode
}

export interface CatalogField {
  name: string
  label: string
  type?: 'text' | 'number'
  placeholder?: string
  required?: boolean
  hint?: string
}

interface CatalogCrudPageProps<T> {
  overline: string
  title: string
  description: string
  singular: string
  rows: T[]
  loading?: boolean
  error?: string
  columns: CatalogColumn<T>[]
  fields: CatalogField[]
  initialValues: Record<string, string | number>
  toValues: (row: T) => Record<string, string | number>
  onCreate: (values: Record<string, string | number>) => Promise<void>
  onUpdate: (row: T, values: Record<string, string | number>) => Promise<void>
  onDelete: (row: T) => Promise<void>
  onReload: () => void
  addLabel?: string
  emptyDescription?: string
}

export default function CatalogCrudPage<T>({
  overline,
  title,
  description,
  singular,
  rows,
  loading,
  error,
  columns,
  fields,
  initialValues,
  toValues,
  onCreate,
  onUpdate,
  onDelete,
  onReload,
  addLabel,
  emptyDescription,
}: CatalogCrudPageProps<T>) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [values, setValues] = useState<Record<string, string | number>>(initialValues)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const dialogTitle = useMemo(
    () => (editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`),
    [editing, singular]
  )

  const openCreate = () => {
    setEditing(null)
    setValues(initialValues)
    setFormError('')
    setOpen(true)
  }

  const openEdit = (row: T) => {
    setEditing(row)
    setValues(toValues(row))
    setFormError('')
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setEditing(null)
  }

  const handleSave = async () => {
    const missing = fields.find(
      (field) => field.required && `${values[field.name] ?? ''}`.trim() === ''
    )
    if (missing) {
      setFormError(`${missing.label} is required.`)
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await onUpdate(editing, values)
      } else {
        await onCreate(values)
      }
      close()
      onReload()
    } catch (e) {
      setFormError(`The ${singular.toLowerCase()} could not be saved.`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row: T) => {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) return
    try {
      await onDelete(row)
      onReload()
    } catch (e) {
      window.alert(`The ${singular.toLowerCase()} could not be deleted.`)
    }
  }

  return (
    <Box>
      <PageHeader
        overline={overline}
        title={title}
        description={description}
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />} onClick={openCreate}>
            {addLabel ?? `Add ${singular.toLowerCase()}`}
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Panel
        title={title}
        subtitle={`${rows.length} ${rows.length === 1 ? 'entry' : 'entries'}`}
        flush
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.label} align={column.align} sx={{ width: column.width }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ width: 96 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length + 1}>
                      <Skeleton variant="rounded" height={24} />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} sx={{ p: 0 }}>
                    <EmptyState
                      title={`No ${title.toLowerCase()} yet`}
                      description={emptyDescription ?? `Add your first ${singular.toLowerCase()} to get started.`}
                      action={
                        <Button variant="outlined" size="small" onClick={openCreate}>
                          {addLabel ?? `Add ${singular.toLowerCase()}`}
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={index} hover>
                    {columns.map((column) => (
                      <TableCell key={column.label} align={column.align}>
                        {column.render(row, index)}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
                        <Tooltip title="Edit" arrow>
                          <IconButton onClick={() => openEdit(row)} aria-label={`Edit ${singular.toLowerCase()}`}>
                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            onClick={() => handleDelete(row)}
                            aria-label={`Delete ${singular.toLowerCase()}`}
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

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 1 }}>
            {editing ? `Update the details of this ${singular.toLowerCase()}.` : `Add a new ${singular.toLowerCase()} to the catalog.`}
          </Typography>
          {formError && <Alert severity="error" sx={{ mt: 1.5 }}>{formError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1.5 }}>
            {fields.map((field) => (
              <Box key={field.name}>
                <Typography
                  component="label"
                  htmlFor={`field-${field.name}`}
                  sx={{ display: 'block', mb: 0.75, fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.03em', color: 'text.secondary' }}
                >
                  {field.label}
                </Typography>
                <TextField
                  id={`field-${field.name}`}
                  fullWidth
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  helperText={field.hint}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : `Add ${singular.toLowerCase()}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
