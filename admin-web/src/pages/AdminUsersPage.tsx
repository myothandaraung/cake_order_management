import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
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
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { adminUsersService } from '@/lib/services'
import { AdminUser } from '@/types'
import { Role } from '@/types/auth'
import { formatDate, initials } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Panel from '@/components/ui/Panel'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'

const emptyForm = { email: '', password: '', name: '', role: Role.STAFF as Role }

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{ display: 'block', mb: 0.75, fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.03em', color: 'text.secondary' }}
    >
      {children}
    </Typography>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await adminUsersService.getAll({ size: 50 })
      setUsers(res.data?.items ?? [])
      setError('')
    } catch (e) {
      setError('We could not load the admin team.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpen = (user?: AdminUser) => {
    if (user) {
      setEditing(user)
      setForm({ email: user.email, password: '', name: user.name, role: user.role })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setFormError('')
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await adminUsersService.update(editing.id, { role: form.role, isActive: true })
      } else {
        await adminUsersService.create(form)
      }
      handleClose()
      fetchUsers()
    } catch (e) {
      setFormError('These details could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Remove ${user.name || user.email} from the admin team?`)) return
    try {
      await adminUsersService.delete(user.id)
      fetchUsers()
    } catch (e) {
      setError('That user could not be removed.')
    }
  }

  return (
    <Box>
      <PageHeader
        overline="Administration"
        title="Admin users"
        description="Who can sign in to the studio, and what they are allowed to do."
        actions={
          <Button variant="contained" startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />} onClick={() => handleOpen()}>
            Add user
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Panel title="Team" subtitle={`${users.length} ${users.length === 1 ? 'account' : 'accounts'}`} flush>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Added</TableCell>
                <TableCell align="right" sx={{ width: 96 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton variant="rounded" height={30} />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <EmptyState
                      icon={<PersonOutlineRoundedIcon />}
                      title="No admin users"
                      description="Invite a colleague to help manage the studio."
                      action={
                        <Button variant="outlined" size="small" onClick={() => handleOpen()}>
                          Add user
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'primary.main',
                            backgroundColor: '#F3E3E1',
                          }}
                        >
                          {initials(user.name, 'A')}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.87rem', fontWeight: 600 }}>{user.name}</Typography>
                          <Typography noWrap sx={{ fontSize: '0.73rem', color: 'text.secondary' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={user.role} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <StatusChip status={user.isActive ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary', fontSize: '0.82rem' }}>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
                        <Tooltip title="Edit user" arrow>
                          <IconButton onClick={() => handleOpen(user)}>
                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove user" arrow>
                          <IconButton
                            onClick={() => handleDelete(user)}
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit admin user' : 'New admin user'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
            {editing
              ? 'Roles decide what this person can access.'
              : 'They will be able to sign in with the email and password you set.'}
          </Typography>
          {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box>
              <FieldLabel htmlFor="admin-name">Full name</FieldLabel>
              <TextField
                id="admin-name"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={Boolean(editing)}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <TextField
                id="admin-email"
                fullWidth
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={Boolean(editing)}
              />
            </Box>
            {!editing && (
              <Box>
                <FieldLabel htmlFor="admin-password">Temporary password</FieldLabel>
                <TextField
                  id="admin-password"
                  fullWidth
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Box>
            )}
            <Box>
              <FieldLabel htmlFor="admin-role">Role</FieldLabel>
              <TextField
                id="admin-role"
                select
                fullWidth
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              >
                <MenuItem value={Role.ADMIN}>Admin — full access</MenuItem>
                <MenuItem value={Role.STAFF}>Staff — day-to-day access</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add user'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
