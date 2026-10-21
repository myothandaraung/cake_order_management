import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined'
import IcecreamOutlinedIcon from '@mui/icons-material/IcecreamOutlined'
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { authService } from '@/lib/auth'
import { initials, todayLabel } from '@/lib/format'

const drawerWidth = 272

const navGroups = [
  {
    label: 'Overview',
    items: [{ text: 'Dashboard', path: '/', icon: SpaceDashboardOutlinedIcon }],
  },
  {
    label: 'Commerce',
    items: [
      { text: 'Orders', path: '/orders', icon: ReceiptLongOutlinedIcon },
      { text: 'Cakes', path: '/cakes', icon: CakeOutlinedIcon },
      { text: 'Customers', path: '/customers', icon: PeopleAltOutlinedIcon },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { text: 'Categories', path: '/categories', icon: CategoryOutlinedIcon },
      { text: 'Sizes', path: '/sizes', icon: StraightenOutlinedIcon },
      { text: 'Flavors', path: '/flavors', icon: IcecreamOutlinedIcon },
      { text: 'Toppings', path: '/toppings', icon: BakeryDiningOutlinedIcon },
    ],
  },
  {
    label: 'Administration',
    items: [
      { text: 'Admin Users', path: '/admin-users', icon: AdminPanelSettingsOutlinedIcon },
      { text: 'Audit Log', path: '/audit', icon: HistoryOutlinedIcon },
    ],
  },
]

function sectionFor(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)) {
        return item.text
      }
    }
  }
  return 'Studio'
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    enabled: authService.isAuthenticated(),
    retry: false,
  })

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      localStorage.removeItem('accessToken')
    }
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.75, pt: 3.25, pb: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '13px',
            display: 'grid',
            placeItems: 'center',
            color: '#F6E7D3',
            fontFamily: (t) => t.typography.h2.fontFamily,
            fontSize: '1.3rem',
            background: 'linear-gradient(145deg, #8B3A4B 0%, #5C1F2C 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.16), 0 8px 18px -12px rgba(92,31,44,0.9)',
          }}
        >
          C
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: (t) => t.typography.h2.fontFamily,
              fontSize: '1.08rem',
              lineHeight: 1.15,
              color: 'text.primary',
            }}
          >
            Cake Studio
          </Typography>
          <Typography
            variant="overline"
            sx={{ fontSize: '0.56rem', letterSpacing: '0.26em', color: 'text.secondary' }}
          >
            Admin
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        {navGroups.map((group) => (
          <Box key={group.label} sx={{ mb: 1.25 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                px: 3,
                pt: 1.5,
                pb: 0.75,
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'text.disabled',
              }}
            >
              {group.label}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <ListItemButton
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onNavigate}
                    sx={{
                      position: 'relative',
                      mx: 1.75,
                      px: 1.5,
                      py: 0.95,
                      mb: 0.25,
                      borderRadius: '10px',
                      color: 'text.secondary',
                      fontSize: '0.855rem',
                      fontWeight: 500,
                      transition: 'background-color 140ms ease, color 140ms ease',
                      '& .MuiListItemIcon-root': { minWidth: 32, color: 'inherit' },
                      '& .MuiListItemText-primary': { fontSize: '0.855rem', fontWeight: 500 },
                      '&:hover': {
                        backgroundColor: 'rgba(35, 28, 31, 0.045)',
                        color: 'text.primary',
                      },
                      '&.active': {
                        backgroundColor: '#F3E3E1',
                        color: 'primary.main',
                        '& .MuiListItemText-primary': { fontWeight: 600 },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -7,
                          top: '24%',
                          bottom: '24%',
                          width: 3,
                          borderRadius: 3,
                          backgroundColor: '#C2A47A',
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Icon sx={{ fontSize: 19 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                )
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider />
      <Box sx={{ p: 2, px: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'primary.main',
              backgroundColor: '#F3E3E1',
              border: '1px solid rgba(122, 46, 62, 0.12)',
            }}
          >
            {initials(user?.name, 'A')}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: '0.81rem', fontWeight: 600, lineHeight: 1.3 }}>
              {user?.name ?? 'Signed in'}
            </Typography>
            <Typography
              noWrap
              variant="overline"
              sx={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: 'text.disabled' }}
            >
              {user?.role ?? ''}
            </Typography>
          </Box>
          <Tooltip title="Sign out" arrow>
            <IconButton onClick={handleLogout} aria-label="Sign out">
              <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

export default function AppLayout() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const section = sectionFor(location.pathname)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              borderRight: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: 'rgba(255, 253, 250, 0.92)',
              backdropFilter: 'blur(12px)',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              border: 'none',
              borderRight: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: 'background.paper',
            },
          }}
        >
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            height: 68,
            px: { xs: 2.5, md: 4.5 },
            backgroundColor: 'rgba(246, 241, 234, 0.78)',
            backdropFilter: 'blur(14px)',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            {!isDesktop && (
              <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation" sx={{ ml: -0.75 }}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Typography
              variant="overline"
              sx={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'text.disabled' }}
            >
              Studio
            </Typography>
            <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              /
            </Box>
            <Typography
              noWrap
              sx={{
                fontFamily: (t) => t.typography.h2.fontFamily,
                fontSize: '0.98rem',
                color: 'text.primary',
              }}
            >
              {section}
            </Typography>
          </Box>

          <Typography
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontSize: '0.76rem',
              letterSpacing: '0.04em',
              color: 'text.secondary',
            }}
          >
            {todayLabel()}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: 1280,
            mx: 'auto',
            px: { xs: 2.5, md: 4.5 },
            py: { xs: 3.5, md: 4.5 },
            pb: 8,
          }}
        >
          <Box key={location.pathname} className="route-enter">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
