import { Box, Divider, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  /** Remove the inner gutter (useful when the child is a full-bleed table). */
  flush?: boolean
  sx?: object
}

export default function Panel({ title, subtitle, action, children, flush, sx }: PanelProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: '18px',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {(title || action) && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              px: { xs: 2.25, md: 3 },
              py: 2.25,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {title && (
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.h4.fontFamily,
                    fontSize: '1.1rem',
                    color: 'text.primary',
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.25 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
          </Box>
          <Divider />
        </>
      )}
      <Box sx={flush ? undefined : { p: { xs: 2.25, md: 3 } }}>{children}</Box>
    </Box>
  )
}
