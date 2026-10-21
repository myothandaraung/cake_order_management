import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  overline?: string
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ overline, title, description, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2.5,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {overline && (
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', display: 'block', mb: 0.75 }}
          >
            {overline}
          </Typography>
        )}
        <Typography
          component="h1"
          sx={{
            fontFamily: (t) => t.typography.h2.fontFamily,
            fontSize: { xs: '1.85rem', md: '2.3rem' },
            lineHeight: 1.12,
            letterSpacing: '-0.015em',
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: '0.9rem', maxWidth: 620 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>{actions}</Box>
      )}
    </Box>
  )
}
