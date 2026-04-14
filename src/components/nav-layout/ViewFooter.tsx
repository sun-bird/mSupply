import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserSquareIcon } from '@hugeicons/core-free-icons';
import { Box, Typography } from '@mui/material';
import type { ViewFooterProps } from './nav.types';

export default function ViewFooter({
  storeName = 'Central Tamaki Warehouse',
  userName = 'Mark Prins',
  syncedAt = 'Synced 3 mins ago',
  isOnline = true,
}: ViewFooterProps) {
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
      {/* Store name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorefrontOutlinedIcon
          sx={{ fontSize: 18, color: 'text.secondary' }}
        />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          {storeName}
        </Typography>
      </Box>

      {/* User name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
        <HugeiconsIcon icon={UserSquareIcon} size={18} color="currentColor" />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          {userName}
        </Typography>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Sync status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
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
          }}
        >
          {syncedAt}
        </Typography>
      </Box>
    </Box>
  );
}
