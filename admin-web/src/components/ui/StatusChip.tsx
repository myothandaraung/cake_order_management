import { Box } from '@mui/material'

interface StatusChipProps {
  status: string | null | undefined
  size?: 'small' | 'medium'
}

const styles: Record<string, { bg: string; fg: string; dot: string }> = {
  pending: { bg: '#F7EDDC', fg: '#8E5C26', dot: '#B7793A' },
  confirmed: { bg: '#E9EFF2', fg: '#3D5561', dot: '#48606C' },
  processing: { bg: '#F3E3E1', fg: '#7A2E3E', dot: '#7A2E3E' },
  ready_for_pickup: { bg: '#EDF2EC', fg: '#3C5344', dot: '#4F6B57' },
  out_for_delivery: { bg: '#E7EFEA', fg: '#33574A', dot: '#3C7A5E' },
  delivered: { bg: '#E4EDE6', fg: '#2F4B38', dot: '#4F6B57' },
  cancelled: { bg: '#F8E7E4', fg: '#8A3030', dot: '#A33A3A' },
  refunded: { bg: '#EFECEA', fg: '#6E6367', dot: '#9A8F91' },
  active: { bg: '#E4EDE6', fg: '#2F4B38', dot: '#4F6B57' },
  inactive: { bg: '#EFECEA', fg: '#6E6367', dot: '#9A8F91' },
  admin: { bg: '#F3E3E1', fg: '#7A2E3E', dot: '#7A2E3E' },
  staff: { bg: '#E9EFF2', fg: '#3D5561', dot: '#48606C' },
  create: { bg: '#E4EDE6', fg: '#2F4B38', dot: '#4F6B57' },
  update: { bg: '#E9EFF2', fg: '#3D5561', dot: '#48606C' },
  delete: { bg: '#F8E7E4', fg: '#8A3030', dot: '#A33A3A' },
  status_change: { bg: '#F7EDDC', fg: '#8E5C26', dot: '#B7793A' },
  default: { bg: '#EFECEA', fg: '#6E6367', dot: '#9A8F91' },
}

export default function StatusChip({ status, size = 'medium' }: StatusChipProps) {
  const key = (status ?? '').toLowerCase().replace(/\s+/g, '_')
  const tone = styles[key] ?? styles.default
  const label = status ? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown'

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: size === 'small' ? 1 : 1.25,
        py: size === 'small' ? 0.25 : 0.45,
        borderRadius: '999px',
        backgroundColor: tone.bg,
        color: tone.fg,
        fontSize: size === 'small' ? '0.67rem' : '0.71rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        lineHeight: 1.5,
      }}
    >
      <Box
        component="span"
        sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: tone.dot, flexShrink: 0 }}
      />
      {label}
    </Box>
  )
}
