import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography } from '@mui/material'
import { authService } from '@/lib/auth'
import { Role } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: Role[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const location = useLocation()

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    retry: false,
    enabled: authService.isAuthenticated(),
  })

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            color: '#F6E7D3',
            fontFamily: (t) => t.typography.h2.fontFamily,
            fontSize: '1.35rem',
            background: 'linear-gradient(145deg, #8B3A4B 0%, #5C1F2C 100%)',
            animation: 'pulse 1.8s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.75, transform: 'scale(0.98)' },
              '50%': { opacity: 1, transform: 'scale(1)' },
            },
          }}
        >
          C
        </Box>
        <Typography
          variant="overline"
          sx={{ color: 'text.disabled', fontSize: '0.6rem', letterSpacing: '0.22em' }}
        >
          Opening the studio
        </Typography>
      </Box>
    )
  }

  if (isError || !user) {
    void authService.logout().catch(() => undefined)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
