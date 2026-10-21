import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { Box, Button, InputAdornment, TextField, Typography, IconButton } from '@mui/material'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { authService } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin@123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.login({ email, password })
      window.location.href = '/'
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>
        setError(
          axiosErr.response?.data?.message ||
            (axiosErr.response?.status === 500
              ? 'The server ran into a problem. Please try again.'
              : 'That email and password combination is not recognised.')
        )
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 46%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 6, lg: 7 },
          color: '#F9EFE4',
          background:
            'radial-gradient(120% 90% at 12% 8%, #93424F 0%, #7A2E3E 42%, #4E1A26 100%)',
        }}
      >
        {/* Decorative arcs */}
        {[520, 700, 880].map((size, i) => (
          <Box
            key={size}
            sx={{
              position: 'absolute',
              width: size,
              height: size,
              right: -(size * 0.52),
              bottom: -(size * 0.46),
              borderRadius: '50%',
              border: `1px solid rgba(226, 197, 156, ${0.22 - i * 0.05})`,
              pointerEvents: 'none',
            }}
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            width: 260,
            height: 260,
            left: -80,
            top: '38%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194,164,122,0.22), transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.3rem',
              fontFamily: (t) => t.typography.h2.fontFamily,
              color: '#F8E9D5',
              border: '1px solid rgba(248, 233, 213, 0.35)',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
            }}
          >
            C
          </Box>
          <Box>
            <Typography sx={{ fontFamily: (t) => t.typography.h2.fontFamily, fontSize: '1.1rem', color: '#FBF2E8' }}>
              Cake Studio
            </Typography>
            <Typography variant="overline" sx={{ fontSize: '0.56rem', letterSpacing: '0.26em', color: 'rgba(249,239,228,0.65)' }}>
              Admin
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 460 }}>
          <Typography
            sx={{
              fontFamily: (t) => t.typography.h1.fontFamily,
              fontSize: { md: '2.35rem', lg: '2.9rem' },
              lineHeight: 1.16,
              letterSpacing: '-0.015em',
              color: '#FDF6EE',
            }}
          >
            Every cake counted, every order in its place.
          </Typography>
          <Typography sx={{ mt: 2.5, color: 'rgba(249, 239, 228, 0.72)', fontSize: '0.92rem', maxWidth: 400, lineHeight: 1.7 }}>
            A quiet, considered workspace for the people who make the celebration
            happen — orders, catalogue and customers in one place.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{ width: 26, height: 1, backgroundColor: 'rgba(226, 197, 156, 0.6)' }} />
          <Typography sx={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(249,239,228,0.55)' }}>
            Est. handcrafted
          </Typography>
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 392 }} className="route-enter">
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, mb: 5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '11px',
                display: 'grid',
                placeItems: 'center',
                color: '#F6E7D3',
                fontFamily: (t) => t.typography.h2.fontFamily,
                background: 'linear-gradient(145deg, #8B3A4B 0%, #5C1F2C 100%)',
              }}
            >
              C
            </Box>
            <Typography sx={{ fontFamily: (t) => t.typography.h2.fontFamily, fontSize: '1rem' }}>
              Cake Studio
            </Typography>
          </Box>

          <Typography variant="overline" sx={{ color: 'primary.main' }}>
            Administrator access
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontFamily: (t) => t.typography.h1.fontFamily,
              fontSize: '2.15rem',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              color: 'text.primary',
            }}
          >
            Welcome back
          </Typography>
          <Typography sx={{ mt: 1.25, color: 'text.secondary', fontSize: '0.875rem' }}>
            Sign in to manage orders, cakes and customers.
          </Typography>

          {error && (
            <Box
              sx={{
                mt: 3,
                px: 1.75,
                py: 1.4,
                borderRadius: '12px',
                border: '1px solid rgba(163, 58, 58, 0.22)',
                backgroundColor: '#FBF0EE',
                color: '#7F2A2A',
                fontSize: '0.82rem',
              }}
            >
              {error}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography
              component="label"
              htmlFor="login-email"
              sx={{ display: 'block', mb: 0.9, fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.04em', color: 'text.secondary' }}
            >
              Email address
            </Typography>
            <TextField
              id="login-email"
              fullWidth
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cakestudio.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 3, mb: 0.9 }}>
              <Typography
                component="label"
                htmlFor="login-password"
                sx={{ fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.04em', color: 'text.secondary' }}
              >
                Password
              </Typography>
            </Box>
            <TextField
              id="login-password"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{ mt: 4, py: 1.4 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Typography sx={{ mt: 5, fontSize: '0.72rem', color: 'text.disabled', lineHeight: 1.7 }}>
            Access is limited to authorised staff. Sessions expire automatically for
            your security.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
