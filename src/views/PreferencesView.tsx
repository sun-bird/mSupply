import {
  HelpCircleIcon,
  Moon02Icon,
  PrinterIcon,
  SmartPhone01Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Typography } from '@mui/material';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

export type ColorMode = 'light' | 'dark' | 'system';

interface PreferencesViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

export default function PreferencesView({
  navItems,
  onNavigate,
  colorMode,
  onColorModeChange,
}: PreferencesViewProps) {
  return (
    <NavLayout
      navItems={navItems}
      activePath="/settings/preferences"
      headerProps={{
        title: 'Preferences',
        onBack: () => onNavigate('/dashboard'),
        comboActions: [
          {
            icon: <HugeiconsIcon icon={PrinterIcon} size={20} />,
            label: 'Print',
            onClick: () => {},
          },
          {
            icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />,
            label: 'Help',
            onClick: () => {},
          },
        ],
      }}
      footerProps={{
        storeName: 'Central Tamaki Warehouse',
        userName: 'Mark Prins',
        syncedAt: 'Synced 3 mins ago',
        isOnline: true,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          pt: '40px',
          px: { xs: 1, sm: 0 },
        }}
      >
        {/* Appearance section */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              lineHeight: '24px',
              color: 'text.primary',
              mb: 3,
            }}
          >
            Appearance
          </Typography>

          {/* Color mode toggle — combined inline */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: '24px',
              p: '4px',
              gap: '4px',
              width: 'fit-content',
              mx: 'auto',
            }}
          >
            {(['light', 'dark', 'system'] as const).map((mode) => {
              const isSelected = colorMode === mode;
              const icon = mode === 'light' ? Sun03Icon : mode === 'dark' ? Moon02Icon : SmartPhone01Icon;
              const label = mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System';
              return (
                <Box
                  key={mode}
                  onClick={() => onColorModeChange(mode)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 2,
                    py: 0.75,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 13,
                    transition: 'all 0.15s',
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    color: isSelected ? 'white' : 'text.secondary',
                    boxShadow: isSelected
                      ? '0px 1px 3px rgba(0,0,0,0.12)'
                      : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.main' : 'action.selected',
                    },
                  }}
                >
                  <HugeiconsIcon icon={icon} size={16} />
                  {label}
                </Box>
              );
            })}
          </Box>

          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'text.secondary',
              mt: 2,
            }}
          >
            {colorMode === 'system'
              ? 'Following your operating system preference.'
              : colorMode === 'dark'
                ? 'Dark mode is active.'
                : 'Light mode is active.'}
          </Typography>
        </Box>
      </Box>
    </NavLayout>
  );
}
