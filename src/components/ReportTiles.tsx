import { Pdf01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Report {
  key: string;
  /** Translation key under tenderSuccess.reports */
  labelKey: string;
}

interface ReportTilesProps {
  /** Reports to render. Defaults to the four tender finalisation reports. */
  reports?: Report[];
  /** Click handler — receives the report key. Defaults to no-op. */
  onSelect?: (key: string) => void;
}

const DEFAULT_REPORTS: Report[] = [
  { key: 'evaluation', labelKey: 'evaluation' },
  { key: 'winningLines', labelKey: 'winningLines' },
  { key: 'allResponses', labelKey: 'allResponses' },
  { key: 'preferredOnly', labelKey: 'preferredOnly' },
];

/**
 * Row of clickable PDF report tiles shown after a tender is finalised
 * (matches Figma node 6602-13799).
 */
export default function ReportTiles({
  reports = DEFAULT_REPORTS,
  onSelect,
}: ReportTilesProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {reports.map((report) => (
        <ButtonBase
          key={report.key}
          onClick={() => onSelect?.(report.key)}
          sx={{
            width: 160,
            height: 160,
            bgcolor: 'background.paper',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'transform 120ms ease, box-shadow 120ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.12)',
            },
            '&:focus-visible': {
              outline: `2px solid ${primaryColor}`,
              outlineOffset: 2,
            },
          }}
        >
          <HugeiconsIcon icon={Pdf01Icon} size={48} color={primaryColor} />
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '16px',
              color: 'text.primary',
              textAlign: 'center',
              whiteSpace: 'pre-line',
              px: 1,
            }}
          >
            {t(`tenderSuccess.reports.${report.labelKey}`)}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
