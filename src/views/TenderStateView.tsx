import { HelpCircleIcon, PrinterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';
import TenderStepPanel from '../components/tender/TenderStepPanel';
import { getTenderSteps } from '../components/tender/tender.types';
import type { TenderRow } from './TendersView';

interface TenderStateViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
}

const STEP_META: Record<string, { titleKey: string; descriptionKey: string }> = {
  plan: { titleKey: 'tenderState.plan', descriptionKey: 'tenderState.planDescription' },
  items: { titleKey: 'tenderState.items', descriptionKey: 'tenderState.itemsDescription' },
  source: { titleKey: 'tenderState.source', descriptionKey: 'tenderState.sourceDescription' },
  evaluate: { titleKey: 'tenderState.evaluate', descriptionKey: 'tenderState.evaluateDescription' },
  award: { titleKey: 'tenderState.award', descriptionKey: 'tenderState.awardDescription' },
};

export default function TenderStateView({ navItems, onNavigate, tender }: TenderStateViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const steps = getTenderSteps(tender.status);

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      headerProps={{
        title: `${tender.serial} - ${t('tenderState.title')}`,
        onBack: () => onNavigate('/replenishment/tenders'),
        comboActions: [
          { icon: <HugeiconsIcon icon={PrinterIcon} size={20} />, label: t('common.print'), onClick: () => {} },
          { icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />, label: t('common.help'), onClick: () => {} },
        ],
      }}
      footerProps={{
        storeName: 'Central Tamaki Warehouse',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', mt: '80px' }}>
        {steps.map((step) => {
          const meta = STEP_META[step.key];
          const isAward = step.key === 'award';

          return (
            <TenderStepPanel
              key={step.key}
              step={step}
              title={t(meta.titleKey)}
              description={t(meta.descriptionKey)}
              onView={() => {
                // Sub-pages to be implemented later
              }}
              {...(isAward && {
                onAction: () => {
                  // Finalise tender action to be implemented later
                },
                actionLabel: t('tenderState.finaliseTender'),
              })}
            />
          );
        })}
      </Box>

      {/* Footer info */}
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            color: 'text.secondary',
          }}
        >
          {t('tenderState.tenderCreated', { date: tender.created })}{' '}
          <Typography
            component="span"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'text.secondary',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {t('tenderState.viewLog')}
          </Typography>
        </Typography>
      </Box>
    </NavLayout>
  );
}
