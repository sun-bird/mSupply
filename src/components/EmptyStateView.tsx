import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import { Box, Button, Typography, useTheme } from '@mui/material';

/**
 * EmptyStateView
 *
 * Used inside any view that doesn't yet have data to show — either because
 * a prerequisite step hasn't been completed (e.g. Items has no entries until
 * Plan is filled in) or because the user hasn't created any records yet.
 *
 * Layout (matches Figma node 6210-22902):
 *   1. Centered illustration (large Hugeicon, tinted with theme.primary)
 *   2. Muted body copy explaining why nothing is here
 *   3. Optional primary CTA that routes the user to the relevant action
 *
 * The component is intentionally generic so it can be reused across the
 * five tender steps (Plan/Items/Source/Evaluate/Award) and any future view.
 */
interface EmptyStateViewProps {
  /** Hugeicon to render as the illustration. */
  icon: IconSvgElement;
  /** Body copy explaining the empty state. */
  description: string;
  /** CTA button label. Omit to render no button. */
  actionLabel?: string;
  /** CTA click handler. Required if actionLabel is provided. */
  onAction?: () => void;
}

export default function EmptyStateView({
  icon,
  description,
  actionLabel,
  onAction,
}: EmptyStateViewProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 480,
        mx: 'auto',
        mt: { xs: 4, sm: 8 },
        px: 2,
        gap: 4,
      }}
    >
      {/* Illustration */}
      <Box
        sx={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.action.hover,
          color: primaryColor,
        }}
      >
        <HugeiconsIcon icon={icon} size={80} color="currentColor" strokeWidth={1.5} />
      </Box>

      {/* Description */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          color: 'text.secondary',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            bgcolor: primaryColor,
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
            '&:hover': {
              bgcolor: primaryColor,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.18)',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
