import { CheckmarkCircle01Icon, CircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const STEPS = ['plan', 'items', 'source', 'evaluate', 'award'] as const;
type Step = (typeof STEPS)[number];

const STEP_ROUTES: Record<string, string> = {
  plan: '/tenders/plan',
  items: '/tenders/items',
  source: '/tenders/source',
  evaluate: '/tenders/evaluate',
  award: '/tenders/award',
};

interface StatusControllerProps {
  activeStep: Step;
  onNavigate: (path: string) => void;
}

export default function StatusController({ activeStep, onNavigate }: StatusControllerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  // Fold to a Select once the header gets crowded. Below 700px the chip row
  // and the title start fighting for space, so collapse to a dropdown there.
  const isSmall = useMediaQuery(theme.breakpoints.down(700));

  const activeIndex = STEPS.indexOf(activeStep);

  if (isSmall) {
    return (
      <Select
        value={activeStep}
        size="small"
        onChange={(e) => {
          const route = STEP_ROUTES[e.target.value];
          if (route && e.target.value !== activeStep) onNavigate(route);
        }}
        sx={{
          ml: 1,
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: primaryColor,
          '& .MuiSelect-select': { py: 0.5, pr: 3, pl: 1 },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
          '& .MuiSvgIcon-root': { fontSize: 16, color: 'text.secondary' },
        }}
      >
        {STEPS.map((step, i) => {
          const isActive = step === activeStep;
          const isCompleted = i < activeIndex;
          const isNavigable = step in STEP_ROUTES;
          return (
            <MenuItem key={step} value={step} disabled={!isNavigable && !isActive}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HugeiconsIcon
                  icon={isCompleted || isActive ? CheckmarkCircle01Icon : CircleIcon}
                  size={12}
                  color={isActive ? primaryColor : theme.palette.text.secondary}
                />
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? primaryColor : 'text.secondary' }}>
                  {t(`tenderState.${step}`)}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 2 }}>
      {STEPS.map((step, i) => {
        const isActive = step === activeStep;
        const isCompleted = i < activeIndex;
        const isNavigable = step in STEP_ROUTES;
        const color = isActive ? primaryColor : theme.palette.text.secondary;
        return (
          <Box
            key={step}
            onClick={isNavigable && !isActive ? () => onNavigate(STEP_ROUTES[step]) : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: isNavigable && !isActive ? 'pointer' : 'default',
              '&:hover': isNavigable && !isActive ? { opacity: 0.7 } : {},
            }}
          >
            <HugeiconsIcon icon={isCompleted || isActive ? CheckmarkCircle01Icon : CircleIcon} size={12} color={color} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: isActive ? 600 : 400, color }}>
              {t(`tenderState.${step}`)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
