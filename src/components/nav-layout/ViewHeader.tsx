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
import { useTranslation } from 'react-i18next';
import type { ViewHeaderProps } from './nav.types';

interface ViewHeaderInternalProps extends ViewHeaderProps {
  onMenuToggle?: () => void;
}

export default function ViewHeader({
  title,
  afterTitle,
  onBack,
  primaryAction,
  secondaryActions = [],
  comboActions = [],
  onMenuToggle,
}: ViewHeaderInternalProps) {
  const { t } = useTranslation();
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
            aria-label={t('common.openNavigation')}
            size="small"
            sx={{ mr: 0.5, color: 'primary.main' }}
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </IconButton>
        )}

        {/* Back + Title — flexes and truncates so a long title can't push the
            status select or action group off-screen on narrow viewports. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minWidth: 0,
            flex: '1 1 auto',
          }}
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              aria-label={t('common.goBack')}
              sx={{ color: 'primary.main', flexShrink: 0 }}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={3} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: { xs: 15, sm: 18 },
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {title.includes(' > ') ? (
              <>
                {title.split(' > ')[0]} {' '}<Box component="span" sx={{ fontWeight: 500 }}>{title.split(' > ').slice(1).join(' > ')}</Box>
              </>
            ) : title}
          </Typography>
          {afterTitle && <Box sx={{ flexShrink: 0 }}>{afterTitle}</Box>}
        </Box>

        {/* Primary CTA — collapses to an icon-only round button on mobile so
            the toolbar can hold the title, status select and CTA at 375px. */}
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            variant="outlined"
            size="small"
            startIcon={primaryAction.icon}
            aria-label={primaryAction.label}
            sx={{
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: 'text.primary',
              borderColor: 'transparent',
              bgcolor: 'background.paper',
              boxShadow:
                '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              px: { xs: 1, sm: 2.5 },
              minWidth: { xs: 40, sm: 'auto' },
              height: 40,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              // On mobile, hide the label and the icon's right margin so the
              // button renders as a perfect circle around the icon.
              '& .MuiButton-startIcon': {
                mr: { xs: 0, sm: 1 },
                ml: { xs: 0, sm: -0.5 },
              },
              '& .button-label': {
                display: { xs: 'none', sm: 'inline' },
              },
              '&:hover': {
                borderColor: 'transparent',
                bgcolor: 'action.hover',
                boxShadow:
                  '0px 0px 2px rgba(40,41,61,0.08), 0px 4px 12px rgba(96,97,112,0.24)',
              },
            }}
          >
            <Box component="span" className="button-label">{primaryAction.label}</Box>
          </Button>
        )}

        {/* Secondary action buttons */}
        {secondaryActions.map((action, i) => (
          <Button
            key={i}
            onClick={action.onClick}
            variant="outlined"
            size="small"
            startIcon={action.icon}
            sx={{
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: 'text.primary',
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
            {action.label}
          </Button>
        ))}

        {/* Combo action buttons — hidden on mobile to keep the toolbar from
            overflowing; the same actions still sit behind the nav drawer. */}
        {comboActions.length > 0 && (
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'background.paper',
              boxShadow:
                '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              borderRadius: 24,
              px: 1.5,
              height: 40,
              flexShrink: 0,
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
