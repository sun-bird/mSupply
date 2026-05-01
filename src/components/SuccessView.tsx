import { Box, Typography } from '@mui/material';
import PrimaryCtaButton from './PrimaryCtaButton';
import ReportTiles from './ReportTiles';

/**
 * SuccessView
 *
 * Shown after a long-running flow completes successfully (e.g. once a tender
 * has been finalised). The tile row at the top surfaces downloadable PDF
 * reports (matches Figma node 6602-13799).
 */
interface SuccessViewProps {
  /** Body copy describing the outcome. */
  description: string;
  /** CTA button label. Omit to render no button. */
  actionLabel?: string;
  /** CTA click handler. Required if actionLabel is provided. */
  onAction?: () => void;
  /** Fired when a report tile is clicked. */
  onSelectReport?: (key: string) => void;
}

export default function SuccessView({
  description,
  actionLabel,
  onAction,
  onSelectReport,
}: SuccessViewProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 720,
        mx: 'auto',
        mt: { xs: 9, sm: 13 },
        px: 2,
        gap: 4,
      }}
    >
      {/* Report tiles */}
      <ReportTiles onSelect={onSelectReport} />

      {/* Description */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          color: 'text.secondary',
          lineHeight: 1.6,
          mt: '28px',
          maxWidth: 480,
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
