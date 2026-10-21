import { useRef, useState } from 'react'
import { Alert, Box, Button, IconButton, LinearProgress, Typography } from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { filesService } from '@/lib/services'
import { apiErrorMessage } from '@/lib/errors'
import { colors } from '@/theme'

const MAX_MB = 5
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  /** Lets the parent disable submit while an upload is in flight. */
  onBusyChange?: (busy: boolean) => void
  /** Folder inside the storage bucket. */
  folder?: string
}

export default function ImageUploader({
  value,
  onChange,
  onBusyChange,
  folder = 'cakes',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const setBusy = (busy: boolean) => {
    setUploading(busy)
    onBusyChange?.(busy)
  }

  const openPicker = () => {
    if (!uploading) inputRef.current?.click()
  }

  const handleFile = async (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose a JPG, PNG, WebP, GIF or AVIF image.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Images must be ${MAX_MB} MB or smaller.`)
      return
    }

    setError('')
    setProgress(0)
    setBusy(true)
    try {
      const { data } = await filesService.upload(file, {
        folder,
        onProgress: setProgress,
      })
      onChange(data.url)
      setProgress(100)
    } catch (e) {
      setError(apiErrorMessage(e, 'The photo could not be uploaded. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      <Box
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault()
          if (!uploading) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!uploading) handleFile(e.dataTransfer.files?.[0])
        }}
        sx={{
          position: 'relative',
          aspectRatio: '4 / 3',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          cursor: uploading ? 'progress' : 'pointer',
          border: '1px dashed',
          borderColor: dragging ? 'primary.main' : value ? 'transparent' : 'divider',
          background: dragging
            ? colors.rosewoodSoft
            : 'radial-gradient(120% 100% at 50% 0%, rgba(194, 164, 122, 0.16), rgba(246, 241, 234, 0.5))',
          transition: 'border-color 160ms ease, background 160ms ease',
          '&:hover': { borderColor: value ? 'transparent' : 'rgba(194, 164, 122, 0.9)' },
          '&:hover .uploader-overlay, &:focus-within .uploader-overlay': { opacity: 1 },
        }}
      >
        {value ? (
          <>
            <Box
              component="img"
              src={value}
              alt="Cake photo"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              className="uploader-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(35, 28, 31, 0) 45%, rgba(35, 28, 31, 0.62) 100%)',
                opacity: 0,
                transition: 'opacity 160ms ease',
              }}
            />
            <Box
              className="uploader-overlay"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                right: 10,
                display: 'flex',
                justifyContent: 'flex-start',
                opacity: 0,
                transition: 'opacity 160ms ease',
              }}
            >
              <Button
                size="small"
                variant="contained"
                startIcon={<RefreshRoundedIcon sx={{ fontSize: 15 }} />}
                onClick={(e) => {
                  e.stopPropagation()
                  openPicker()
                }}
                sx={{ backgroundColor: 'rgba(255, 253, 250, 0.94)', color: colors.ink, '&:hover': { backgroundColor: '#FFFDFA' } }}
              >
                Replace
              </Button>
            </Box>
            <IconButton
              aria-label="Remove cake photo"
              onClick={(e) => {
                e.stopPropagation()
                setError('')
                onChange('')
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 253, 250, 0.94)',
                border: (t) => `1px solid ${t.palette.divider}`,
                color: colors.clay,
                '&:hover': { backgroundColor: '#FFFDFA', color: colors.clay },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', px: 2.5, py: 2 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                mx: 'auto',
                mb: 1.5,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'rgba(255, 253, 250, 0.9)',
                border: (t) => `1px solid ${t.palette.divider}`,
                color: colors.gold,
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary' }}>
              Drop a photo here
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, mb: 1.5 }}>
              or choose a file · JPG, PNG, WebP · up to {MAX_MB} MB
            </Typography>
            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); openPicker() }}>
              Browse files
            </Button>
          </Box>
        )}

        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'rgba(246, 241, 234, 0.86)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <Box sx={{ width: '62%', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                Uploading… {progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 5, borderRadius: 999, backgroundColor: 'rgba(122, 46, 62, 0.12)' }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
