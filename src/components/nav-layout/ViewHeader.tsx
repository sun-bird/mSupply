import { ArrowLeft01Icon, HelpCircleIcon, Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { ViewHeaderProps } from './nav.types';

interface ViewHeaderInternalProps extends ViewHeaderProps {
  onMenuToggle?: () => void;
}

export default function ViewHeader({
  title,
  onBack,
  primaryAction,
  comboActions = [],
  onMenuToggle,
}: ViewHeaderInternalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'transparent',
        color: 'text.primary',
        boxShadow: 'none',
        zIndex: 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 60 },
          px: { xs: 1.5, sm: 2.5 },
          gap: 1,
        }}
      >
        {/* Mobile hamburger */}
        {isMobile && onMenuToggle && (
          <IconButton
            edge="start"
            onClick={onMenuToggle}
            aria-label="open navigation"
            size="small"
            sx={{ mr: 0.5, color: 'primary.main' }}
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </IconButton>
        )}

        {/* Back + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              aria-label="go back"
              sx={{ color: 'primary.main' }}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 18,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Primary CTA */}
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            variant="outlined"
            size="small"
            startIcon={primaryAction.icon}
            sx={{
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: 'primary.main',
              borderColor: 'transparent',
              bgcolor: 'background.paper',
              boxShadow:
                '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              px: 2.5,
              height: 40,
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: 'transparent',
                bgcolor: 'action.hover',
                boxShadow:
                  '0px 0px 2px rgba(40,41,61,0.08), 0px 4px 12px rgba(96,97,112,0.24)',
              },
            }}
          >
            {primaryAction.label}
          </Button>
        )}

        {/* Combo action buttons */}
        {comboActions.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'background.paper',
              boxShadow:
                '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              borderRadius: 24,
              px: 1.5,
              height: 40,
            }}
          >
            {comboActions.map((action, i) => (
              <Tooltip key={i} title={action.label}>
                <IconButton
                  onClick={action.onClick}
                  size="small"
                  aria-label={action.label}
                  sx={{
                    color: 'primary.main',
                    p: 0.75,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Default help icon if no combo actions provided */}
        {comboActions.length === 0 && (
          <Tooltip title="Help">
            <IconButton
              size="small"
              sx={{ color: 'primary.main', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <HugeiconsIcon icon={HelpCircleIcon} size={20} />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
