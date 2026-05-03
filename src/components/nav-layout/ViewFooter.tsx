import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserSquareIcon } from '@hugeicons/core-free-icons';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { ViewFooterProps } from './nav.types';

/** Hard-cap a label so the footer never overflows on a small screen: any
 *  string longer than 10 chars is sliced and appended with an ellipsis. */
function clipForMobile(value: string, isMobile: boolean): string {
  if (!isMobile || value.length <= 10) return value;
  return value.slice(0, 10) + '…';
}

export default function ViewFooter({
  storeName = 'Central HQ',
  userName = 'Mark Prins',
  syncedAt = 'Synced 3 mins ago',
  isOnline = true,
}: ViewFooterProps) {
  const theme = useTheme();
  // Treat anything below `md` (900px) as "mobile" for the purposes of the
  // 10-char label clip — tablet widths show the full footer row but the
  // labels need to stay short to avoid wrapping.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 2.5 },
        height: 60,
        flexShrink: 0,
      }}
    >
      {/* Store name — clipped to 10 chars on mobile so the row never overflows. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flexShrink: 1 }}>
        <StorefrontOutlinedIcon
          sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {clipForMobile(storeName, isMobile)}
        </Typography>
      </Box>

      {/* User name — visible at every breakpoint; the 10-char clip keeps it
          short enough to fit alongside the store name on mobile. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', flexShrink: 0 }}>
        <HugeiconsIcon icon={UserSquareIcon} size={18} color="currentColor" />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          {clipForMobile(userName, isMobile)}
        </Typography>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Sync status — label hides below `md`; the icon colour still signals
          online/offline at every breakpoint. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
        <SyncIcon
          sx={{
            fontSize: 18,
            color: isOnline ? 'success.main' : 'text.disabled',
          }}
        />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            display: { xs: 'none', md: 'inline' },
          }}
        >
          {clipForMobile(syncedAt, isMobile)}
        </Typography>
      </Box>
    </Box>
  );
}
