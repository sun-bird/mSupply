import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  FileEditIcon,
  Package02Icon,
  UserGroupIcon,
  TaskEdit01Icon,
  AwardIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TenderStep } from './tender.types';
import { getCountLabelKey } from './tender.types';

interface TenderStepPanelProps {
  step: TenderStep;
  title: string;
  description: string;
  onView: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

const STEP_ICONS: Record<string, typeof FileEditIcon> = {
  plan: TaskEdit01Icon,
  items: Package02Icon,
  source: UserGroupIcon,
  evaluate: FileEditIcon,
  award: AwardIcon,
};

export default function TenderStepPanel({
  step,
  title,
  description,
  onView,
  onAction,
  actionLabel,
}: TenderStepPanelProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const primaryColor = theme.palette.primary.main;
  const isComplete = step.status === 'complete';
  const isNextUp = step.status === 'nextUp';
  const isIncomplete = step.status === 'incomplete';

  const StepIcon = STEP_ICONS[step.key] ?? FileEditIcon;

  // Format the count label via i18n. `award` has no count key, so the
  // panel skips the label entirely for that step.
  const countKey = getCountLabelKey(step.key);
  const countLabel = countKey ? t(countKey, { count: step.count }) : '';

  return (
    <Box
      onClick={onView}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '12px',
        px: 3,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: isNextUp
          ? '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)'
          : '0px 0px 2px rgba(40,41,61,0.04)',
        border: isNextUp ? `1px solid ${primaryColor}` : undefined,
        opacity: isIncomplete ? 0.6 : 1,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
        },
      }}
    >
      {/* Checkmark */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: isComplete ? '#05A660' : 'transparent',
          border: isComplete
            ? 'none'
            : isNextUp
              ? '2px solid #05A660'
              : '2px solid #C7C7D1',
          boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
        }}
      >
        {isComplete && (
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} color="white" />
        )}
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 18,
          color: isIncomplete ? 'text.secondary' : 'text.primary',
          minWidth: 80,
        }}
      >
        {title}
      </Typography>

      {/* Step Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <HugeiconsIcon
          icon={StepIcon}
          size={32}
          color={isIncomplete ? '#C7C7D1' : primaryColor}
        />
      </Box>

      {/* Description */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          color: 'text.secondary',
          flex: 1,
        }}
      >
        {description}
      </Typography>

      {/* Right side: count + view link OR action button. Followed by a
          right-chevron affordance to reinforce that the row is clickable. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {onAction && actionLabel && isNextUp ? (
          <Button
            variant="contained"
            onClick={onAction}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '24px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: primaryColor,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
              },
            }}
          >
            {actionLabel}
          </Button>
        ) : (
          <>
            {countLabel && (
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                }}
              >
                {countLabel}
              </Typography>
            )}
          </>
        )}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={20}
          color={isIncomplete ? '#C7C7D1' : '#555770'}
        />
      </Box>
    </Box>
  );
}
