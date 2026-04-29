import { Button, useTheme } from '@mui/material';
import type { ButtonProps } from '@mui/material';

/**
 * The pill-shaped, uppercase, contained primary CTA used across the app for
 * headline actions (e.g. "Tender overview" on empty states, "Done" at the
 * bottom of the tender plan view, etc.).
 *
 * Wraps MUI's <Button variant="contained"> with our standard:
 *  - Inter 14/500 with 0.5px letter-spacing, uppercased
 *  - 24px pill radius, generous horizontal padding
 *  - Material-style elevation that strengthens slightly on hover
 *  - Hover darken via theme.palette.primary.dark so brand colours apply
 *
 * Pass an `sx` to override any individual property (e.g. tighter padding
 * for inline placements, custom min-width, etc.). All other Button props
 * (`onClick`, `disabled`, `startIcon`, ...) are forwarded.
 */
export default function PrimaryCtaButton({ sx, children, ...rest }: ButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: theme.palette.primary.main,
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderRadius: '24px',
        px: 4,
        py: 1.25,
        boxShadow:
          '0px 1px 5px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.20)',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.18)',
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
