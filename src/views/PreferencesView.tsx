import {
  HelpCircleIcon,
  Moon02Icon,
  PrinterIcon,
  SmartPhone01Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';
import type { SavedTheme } from './ThemeEditorView';

export type ColorMode = 'light' | 'dark' | 'system';

interface PreferencesViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  logoUrl?: string;
  savedThemes: SavedTheme[];
  activeThemeId: string | null;
  onSelectTheme: (id: string) => void;
}

export default function PreferencesView({
  navItems,
  onNavigate,
  colorMode,
  onColorModeChange,
  logoUrl,
  savedThemes,
  activeThemeId,
  onSelectTheme,
}: PreferencesViewProps) {
  const { t } = useTranslation();

  return (
    <NavLayout
      navItems={navItems}
      activePath="/settings/preferences"
      logoUrl={logoUrl}
      headerProps={{
        title: t('preferences.title'),
        onBack: () => onNavigate('/dashboard'),
        comboActions: [
          {
            icon: <HugeiconsIcon icon={PrinterIcon} size={20} />,
            label: t('common.print'),
            onClick: () => {},
          },
          {
            icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />,
            label: t('common.help'),
            onClick: () => {},
          },
        ],
      }}
      footerProps={{
        storeName: 'Central HQ',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
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
            {t('preferences.appearance')}
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
              const label = mode === 'light' ? t('preferences.light') : mode === 'dark' ? t('preferences.dark') : t('preferences.system');
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
              textAlign: 'center',
            }}
          >
            {colorMode === 'system'
              ? t('preferences.systemActive')
              : colorMode === 'dark'
                ? t('preferences.darkActive')
                : t('preferences.lightActive')}
          </Typography>

        </Box>

        {/* Theme card */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
            p: 3,
            mt: 3,
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
            {t('preferences.theme')}
          </Typography>

          <Select
            value={activeThemeId ?? ''}
            onChange={(e) => onSelectTheme(e.target.value as string)}
            size="small"
            displayEmpty
            renderValue={(val) => {
              const found = savedThemes.find((s) => s.id === val);
              return found?.themeName ?? '';
            }}
            sx={{
              minWidth: 200,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { textAlign: 'left' },
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: 'text.secondary',
            }}
          >
            {savedThemes.map((theme) => (
              <MenuItem
                key={theme.id}
                value={theme.id}
                sx={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                {theme.logoDataUrl ? (
                  <Box
                    component="img"
                    src={theme.logoDataUrl}
                    alt=""
                    sx={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      bgcolor: theme.primaryColor,
                      flexShrink: 0,
                    }}
                  />
                )}
                {theme.themeName}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Language card */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
            p: 3,
            mt: 3,
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
            {t('preferences.language')}
          </Typography>

          <Select
            value={i18next.language}
            onChange={(e) => i18next.changeLanguage(e.target.value as string)}
            size="small"
            sx={{
              minWidth: 200,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { textAlign: 'left' },
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: 'text.secondary',
            }}
          >
            <MenuItem value="en" sx={{ fontSize: 13 }}>English</MenuItem>
            <MenuItem value="ar" sx={{ fontSize: 13 }}>العربية</MenuItem>
            <MenuItem value="bn" sx={{ fontSize: 13 }}>বাংলা</MenuItem>
            <MenuItem value="fr" sx={{ fontSize: 13 }}>Français</MenuItem>
            <MenuItem value="es" sx={{ fontSize: 13 }}>Español</MenuItem>
            <MenuItem value="fj" sx={{ fontSize: 13 }}>Vosa Vakaviti</MenuItem>
            <MenuItem value="to" sx={{ fontSize: 13 }}>Lea faka-Tonga</MenuItem>
          </Select>
        </Box>
      </Box>
    </NavLayout>
  );
}
