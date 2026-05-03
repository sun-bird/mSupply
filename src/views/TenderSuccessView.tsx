import { HelpCircleIcon, PrinterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslation } from 'react-i18next';
import SuccessView from '../components/SuccessView';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';
import type { TenderRow } from './TendersView';

interface TenderSuccessViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

export default function TenderSuccessView({
  navItems,
  onNavigate,
  tender,
  logoUrl,
}: TenderSuccessViewProps) {
  const { t } = useTranslation();

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        onBack: () => onNavigate('/tenders'),
        comboActions: [
          { icon: <HugeiconsIcon icon={PrinterIcon} size={20} />, label: t('common.print'), onClick: () => {} },
          { icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />, label: t('common.help'), onClick: () => {} },
        ],
      }}
      footerProps={{
        storeName: 'Central HQ',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      <SuccessView
        description={t('tenderSuccess.description')}
        actionLabel={t('tenderSuccess.backToTenders')}
        onAction={() => onNavigate('/tenders')}
      />
    </NavLayout>
  );
}
