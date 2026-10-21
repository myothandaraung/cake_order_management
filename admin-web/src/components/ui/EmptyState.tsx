import { Box, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1,
        py: 7,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: 'rgba(194, 164, 122, 0.14)',
          color: '#9A7C4E',
          mb: 1,
          '& svg': { fontSize: 24 },
        }}
      >
        {icon ?? <InboxOutlinedIcon />}
      </Box>
      <Typography
        sx={{
          fontFamily: (t) => t.typography.h4.fontFamily,
          fontSize: '1.05rem',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary', maxWidth: 340 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
    </Box>
  )
}
