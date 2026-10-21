import { createTheme } from '@mui/material/styles'

/**
 * "Maison" design language
 * A warm, editorial patisserie palette: parchment canvas, rosewood ink accents,
 * gold hairlines and a serif display face. Borders do the structural work;
 * shadows are reserved for floating surfaces only.
 */

export const displayFont =
  "'Playfair Display Variable', 'Playfair Display', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
export const bodyFont =
  "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

export const colors = {
  canvas: '#F6F1EA',
  canvasDeep: '#EFE7DD',
  paper: '#FFFDFA',
  ink: '#231C1F',
  inkSoft: '#6E6367',
  inkFaint: '#9A8F91',
  hairline: 'rgba(35, 28, 31, 0.10)',
  hairlineSoft: 'rgba(35, 28, 31, 0.06)',
  rosewood: '#7A2E3E',
  rosewoodDark: '#5C1F2C',
  rosewoodSoft: '#F3E3E1',
  gold: '#C2A47A',
  goldSoft: '#F1E7D6',
  sage: '#4F6B57',
  amber: '#B7793A',
  clay: '#A33A3A',
  slate: '#48606C',
}

const shadowSoft = '0 1px 2px rgba(35, 28, 31, 0.04), 0 18px 44px -26px rgba(35, 28, 31, 0.45)'
const shadowFloat = '0 24px 64px -28px rgba(35, 28, 31, 0.42), 0 2px 6px rgba(35, 28, 31, 0.05)'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.rosewood, dark: colors.rosewoodDark, light: '#9C4B5C', contrastText: '#FFF8F4' },
    secondary: { main: colors.sage, contrastText: '#F7FBF7' },
    background: { default: colors.canvas, paper: colors.paper },
    text: { primary: colors.ink, secondary: colors.inkSoft, disabled: colors.inkFaint },
    divider: colors.hairline,
    success: { main: colors.sage, light: '#E8EFE9', dark: '#3C5344' },
    warning: { main: colors.amber, light: '#F7EBDB', dark: '#8E5C26' },
    error: { main: colors.clay, light: '#F7E4E1', dark: '#7F2A2A' },
    info: { main: colors.slate, light: '#E6EDF0', dark: '#33454E' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: bodyFont,
    fontSize: 14.5,
    htmlFontSize: 16,
    h1: { fontFamily: displayFont, fontWeight: 500, fontSize: '2.5rem', lineHeight: 1.15, letterSpacing: '-0.015em' },
    h2: { fontFamily: displayFont, fontWeight: 500, fontSize: '2rem', lineHeight: 1.2, letterSpacing: '-0.012em' },
    h3: { fontFamily: displayFont, fontWeight: 500, fontSize: '1.6rem', lineHeight: 1.25, letterSpacing: '-0.01em' },
    h4: { fontFamily: displayFont, fontWeight: 500, fontSize: '1.35rem', lineHeight: 1.3 },
    h5: { fontFamily: displayFont, fontWeight: 500, fontSize: '1.15rem', lineHeight: 1.35 },
    h6: { fontFamily: bodyFont, fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0' },
    subtitle1: { fontSize: '0.95rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.02em' },
    body1: { fontSize: '0.9rem', lineHeight: 1.65 },
    body2: { fontSize: '0.825rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em', fontSize: '0.85rem' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    overline: {
      fontFamily: bodyFont,
      fontSize: '0.66rem',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      lineHeight: 1.6,
    },
  },
  shadows: [
    'none',
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowSoft,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
    shadowFloat,
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { colorScheme: 'light' },
        body: {
          backgroundColor: colors.canvas,
          backgroundImage:
            'radial-gradient(900px 520px at 100% -12%, rgba(194, 164, 122, 0.22), transparent 62%), radial-gradient(700px 420px at -8% 106%, rgba(243, 227, 225, 0.75), transparent 60%)',
          backgroundAttachment: 'fixed',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': { backgroundColor: 'rgba(122, 46, 62, 0.16)' },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(35, 28, 31, 0.16)',
          borderRadius: 999,
          border: '3px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${colors.hairline}`,
          borderRadius: 18,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 9,
          minHeight: 40,
        },
        sizeSmall: { paddingInline: 14, paddingBlock: 6, minHeight: 32, fontSize: '0.78rem' },
        sizeLarge: { paddingInline: 26, paddingBlock: 12, minHeight: 46, fontSize: '0.9rem' },
        contained: {
          backgroundImage: 'none',
          boxShadow: '0 10px 24px -16px rgba(92, 31, 44, 0.9)',
          '&:hover': { boxShadow: '0 14px 28px -16px rgba(92, 31, 44, 0.95)' },
        },
        outlined: {
          borderColor: colors.hairline,
          color: colors.ink,
          '&:hover': { borderColor: 'rgba(35, 28, 31, 0.22)', backgroundColor: 'rgba(35, 28, 31, 0.03)' },
        },
        text: {
          color: colors.inkSoft,
          '&:hover': { color: colors.ink, backgroundColor: 'rgba(35, 28, 31, 0.04)' },
        },
      },
    },
    MuiIconButton: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          color: colors.inkSoft,
          borderRadius: 10,
          '&:hover': { color: colors.rosewood, backgroundColor: colors.rosewoodSoft },
        },
        sizeSmall: { padding: 7 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.hairlineSoft}`,
          padding: '15px 20px',
          fontSize: '0.875rem',
          color: colors.ink,
        },
        head: {
          fontFamily: bodyFont,
          fontSize: '0.66rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: colors.inkFaint,
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${colors.hairline}`,
          padding: '12px 20px',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 140ms ease',
          '&:last-of-type td': { borderBottom: 'none' },
          '&.MuiTableRow-hover:hover': { backgroundColor: 'rgba(243, 227, 225, 0.42)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.03em',
          height: 25,
          backgroundColor: colors.goldSoft,
          color: '#6E5326',
        },
        outlined: { borderColor: colors.hairline, backgroundColor: 'transparent', color: colors.inkSoft },
        sizeSmall: { height: 22, fontSize: '0.66rem' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colors.paper,
          fontSize: '0.9rem',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.hairline },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(194, 164, 122, 0.9)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.rosewood,
            borderWidth: 1,
            boxShadow: '0 0 0 3px rgba(122, 46, 62, 0.10)',
          },
        },
        input: { padding: '13px 15px' },
        multiline: { padding: 0 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.88rem', color: colors.inkSoft },
        shrink: { fontSize: '0.85rem' },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: colors.rosewood } },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 4, fontSize: '0.74rem' } },
    },
    MuiSelect: {
      styleOverrides: { select: { padding: '13px 15px' } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 6,
          borderRadius: 14,
          border: `1px solid ${colors.hairline}`,
          boxShadow: shadowFloat,
          padding: 4,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          fontSize: '0.86rem',
          padding: '9px 12px',
          '&.Mui-selected': { backgroundColor: colors.rosewoodSoft, color: colors.rosewood },
          '&.Mui-selected:hover': { backgroundColor: colors.rosewoodSoft },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: `1px solid ${colors.hairline}`,
          boxShadow: shadowFloat,
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 253, 250, 0.98), rgba(255, 253, 250, 1))',
          padding: 6,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: displayFont,
          fontSize: '1.35rem',
          fontWeight: 500,
          padding: '20px 22px 6px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '6px 22px 10px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '10px 22px 18px', gap: 8 } },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44, borderBottom: `1px solid ${colors.hairline}` },
        indicator: { height: 2, backgroundColor: colors.rosewood, borderRadius: 2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          minHeight: 44,
          color: colors.inkSoft,
          paddingInline: 4,
          marginRight: 26,
          '&.Mui-selected': { color: colors.ink },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          fontSize: '0.84rem',
          alignItems: 'center',
        },
        standardError: { borderColor: 'rgba(163, 58, 58, 0.22)', backgroundColor: '#FBF0EE', color: '#7F2A2A' },
        standardSuccess: { borderColor: 'rgba(79, 107, 87, 0.22)', backgroundColor: '#EFF4F0', color: '#3C5344' },
        standardWarning: { borderColor: 'rgba(183, 121, 58, 0.24)', backgroundColor: '#FAF2E7', color: '#8E5C26' },
        standardInfo: { borderColor: 'rgba(72, 96, 108, 0.2)', backgroundColor: '#EEF3F5', color: '#33454E' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.ink,
          fontSize: '0.72rem',
          borderRadius: 8,
          padding: '7px 10px',
          letterSpacing: '0.01em',
        },
        arrow: { color: colors.ink },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: colors.hairline } },
    },
    MuiSkeleton: {
      styleOverrides: { root: { backgroundColor: 'rgba(35, 28, 31, 0.06)', borderRadius: 8 } },
    },
    MuiCircularProgress: {
      styleOverrides: { root: { color: colors.rosewood } },
    },
    MuiFormControlLabel: {
      styleOverrides: { label: { fontSize: '0.86rem' } },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: { color: 'rgba(35, 28, 31, 0.25)', '&.Mui-checked': { color: colors.rosewood } },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 40, height: 24, padding: 0, display: 'flex' },
        switchBase: {
          padding: 3,
          '&.Mui-checked': { transform: 'translateX(16px)', color: '#FFFDFA' },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.sage, opacity: 1 },
        },
        thumb: { width: 18, height: 18, boxShadow: 'none' },
        track: { borderRadius: 999, backgroundColor: 'rgba(35, 28, 31, 0.2)', opacity: 1 },
      },
    },
  },
})
