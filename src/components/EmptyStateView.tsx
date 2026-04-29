import { Box, Typography } from '@mui/material';
import emptyStateImg from '../assets/empty-state.png';
import PrimaryCtaButton from './PrimaryCtaButton';

/**
 * EmptyStateView
 *
 * Used inside any view that doesn't yet have data to show — either because
 * a prerequisite step hasn't been completed (e.g. Items has no entries until
 * Plan is filled in) or because the user hasn't created any records yet.
 *
 * Layout (matches Figma node 6210-22902):
 *   1. Centered illustration ("Missing Running Man" — a single shared image
 *      for every empty state in the app).
 *   2. Muted body copy explaining why nothing is here.
 *   3. Optional primary CTA that routes the user to the relevant action.
 *
 * The component is intentionally generic so it can be reused across the
 * five tender steps (Plan/Items/Source/Evaluate/Award) and any future view.
 */
interface EmptyStateViewProps {
  /** Body copy explaining the empty state. */
  description: string;
  /** CTA button label. Omit to render no button. */
  actionLabel?: string;
  /** CTA click handler. Required if actionLabel is provided. */
  onAction?: () => void;
  /**
   * Override the default illustration. Pass an imported image src to use
   * a different illustration for a particular empty state.
   */
  illustrationSrc?: string;
}

export default function EmptyStateView({
  description,
  actionLabel,
  onAction,
  illustrationSrc = emptyStateImg,
}: EmptyStateViewProps) {
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
        mt: { xs: 9, sm: 13 },
        px: 2,
        gap: 4,
      }}
    >
      {/* Illustration */}
      <Box
        component="img"
        src={illustrationSrc}
        alt=""
        sx={{
          width: 240,
          height: 240,
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Description */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          color: 'text.secondary',
          lineHeight: 1.6,
          // Parent uses gap:4 (32px) between all children. Add 28px of top
          // margin so the image→text gap reads as 60px while text→button
          // stays at the default 32px.
          mt: '28px',
        }}
      >
        {description}
      </Typography>

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <PrimaryCtaButton onClick={onAction}>{actionLabel}</PrimaryCtaButton>
      )}
    </Box>
  );
}
