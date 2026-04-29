import {
  ArrowDown01Icon,
  EyeIcon,
  HelpCircleIcon,
  NoteIcon,
  PrinterIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  InputBase,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import EmptyStateView from '../components/EmptyStateView';
import FinaliseSplash from '../components/tender/FinaliseSplash';
import { getTenderSteps } from '../components/tender/tender.types';
import type { NavItem } from '../components/nav-layout';
import StatusController from '../components/tender/StatusController';
import type { TenderRow } from './TendersView';

const ThinCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

interface AwardItem {
  itemName: string;
  pack: number;
  packSize: number;
  totalQuantity: number;
  units: string;
  preferredSupplier: string;
  currency: string;
  itemManufacturer: string;
  quotedPrice: number;
  quotedPackSize: number;
  netCost: number;
  adjCost: number;
  priceExtension: number | null;
}

const MOCK_AWARD_ITEMS: AwardItem[] = [
  { itemName: 'Acipimox - Cap 250 mg', pack: 5, packSize: 90, totalQuantity: 450, units: 'cap', preferredSupplier: 'Chloe s Consumables', currency: 'NZD', itemManufacturer: 'Alcon New Zealand Ltd', quotedPrice: 20, quotedPackSize: 90, netCost: 18.52, adjCost: 18.52, priceExtension: 92.62 },
  { itemName: 'Adenosine - Inj 3 mg per ml, 10 ml vial', pack: 5, packSize: 5, totalQuantity: 25, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Alere Technologies, Germany', quotedPrice: 37.8, quotedPackSize: 5, netCost: 68.29, adjCost: 68.29, priceExtension: 341.44 },
  { itemName: 'Adenosine - Inj 3 mg per ml, 2 ml vial', pack: 5, packSize: 5, totalQuantity: 25, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Alfa Aesar (part of Thermo Fischer), Germany', quotedPrice: 13.82, quotedPackSize: 5, netCost: 24.96, adjCost: 24.96, priceExtension: 124.81 },
  { itemName: 'Adrenaline - Inj 1 in 1,000, 30 ml vial', pack: 5, packSize: 1, totalQuantity: 5, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Allmed Medical GMBH, Germany', quotedPrice: 10.92, quotedPackSize: 1, netCost: 19.73, adjCost: 19.73, priceExtension: 98.64 },
  { itemName: 'Adrenaline - Inj 1 in 10,000, 10 ml syringe', pack: 5, packSize: 1, totalQuantity: 5, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Altamedics DE, Germany', quotedPrice: 10.92, quotedPackSize: 1, netCost: 19.73, adjCost: 19.73, priceExtension: 98.64 },
  { itemName: 'Adrenaline - Inj 1 in 1,000, 1 ml ampoule', pack: 5, packSize: 50, totalQuantity: 250, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'ASCENT - GERMANY', quotedPrice: 40.05, quotedPackSize: 50, netCost: 72.35, adjCost: 72.35, priceExtension: 361.77 },
  { itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', pack: 5, packSize: 1, totalQuantity: 5, units: 'Inj', preferredSupplier: 'Kahn Medicines', currency: 'USD', itemManufacturer: 'Coopers Surgical, USA', quotedPrice: 13, quotedPackSize: 1, netCost: 20.67, adjCost: 20.67, priceExtension: 103.37 },
  { itemName: 'Alprostadil - Inj 10 mcg vial', pack: 5, packSize: 1, totalQuantity: 5, units: 'Inj', preferredSupplier: 'Kahn Medicines', currency: 'USD', itemManufacturer: 'DAVA (USA)', quotedPrice: 13, quotedPackSize: 1, netCost: 20.67, adjCost: 20.67, priceExtension: 103.37 },
  { itemName: 'Ambrisentan - Tab 10 mg', pack: 5, packSize: 30, totalQuantity: 150, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Gambro Dialysatoren GMBH, Germany', quotedPrice: 75.6, quotedPackSize: 30, netCost: 136.58, adjCost: 136.58, priceExtension: 682.88 },
  { itemName: 'Amiloride hydrochloride - Tab 5 mg', pack: 5, packSize: 90, totalQuantity: 450, units: 'tab', preferredSupplier: 'Chloe s Consumables', currency: 'NZD', itemManufacturer: 'Allergan New Zealand Ltd', quotedPrice: 20, quotedPackSize: 90, netCost: 18.52, adjCost: 18.52, priceExtension: 92.62 },
  { itemName: 'Amiodarone hydrochloride - Inj 50 mg per ml, 3 ml ampoule', pack: 5, packSize: 10, totalQuantity: 50, units: 'Inj', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Henke-Sass, Wolf GmbH, Germany', quotedPrice: 5.75, quotedPackSize: 10, netCost: 10.39, adjCost: 10.39, priceExtension: 51.97 },
  { itemName: 'Amiodarone hydrochloride - Tab 100 mg', pack: 5, packSize: 30, totalQuantity: 150, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Hexal, Germany', quotedPrice: 1.32, quotedPackSize: 30, netCost: 2.38, adjCost: 2.38, priceExtension: 11.92 },
  { itemName: 'Amlodipine - Tab 10 mg', pack: 5, packSize: 90, totalQuantity: 450, units: 'tab', preferredSupplier: 'Luna s Apothecary', currency: 'AUD', itemManufacturer: 'Biological Therapies, Australia', quotedPrice: 1.21, quotedPackSize: 90, netCost: 1.21, adjCost: 1.21, priceExtension: 6.03 },
  { itemName: 'Amlodipine - Tab 5 mg', pack: 5, packSize: 90, totalQuantity: 450, units: 'tab', preferredSupplier: 'Luna s Apothecary', currency: 'AUD', itemManufacturer: 'Blackmores, Australia', quotedPrice: 1.11, quotedPackSize: 90, netCost: 1.11, adjCost: 1.11, priceExtension: 5.57 },
  { itemName: 'Atenolol - Tab 100 mg', pack: 5, packSize: 500, totalQuantity: 2500, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'NOVARTIS, GERMANY', quotedPrice: 6.99, quotedPackSize: 500, netCost: 12.63, adjCost: 12.63, priceExtension: 63.17 },
  { itemName: 'Atorvastatin - Tab 10 mg', pack: 5, packSize: 500, totalQuantity: 2500, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Ratiopharm Germany', quotedPrice: 1.95, quotedPackSize: 500, netCost: 3.52, adjCost: 3.52, priceExtension: 17.62 },
  { itemName: 'Atorvastatin - Tab 20 mg', pack: 5, packSize: 28, totalQuantity: 140, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Rudolph Riester, Germany', quotedPrice: 0.17, quotedPackSize: 28, netCost: 0.31, adjCost: 0.31, priceExtension: 1.54 },
  { itemName: 'Atorvastatin - Tab 40 mg', pack: 5, packSize: 500, totalQuantity: 2500, units: 'tab', preferredSupplier: 'Louisa s Supplies', currency: 'EUR', itemManufacturer: 'Abbott GmbH & Co.KG, Germany', quotedPrice: 5.21, quotedPackSize: 500, netCost: 9.42, adjCost: 9.42, priceExtension: 47.09 },
  { itemName: 'Atropine sulphate - Inj 600 mcg per ml, 1 ml ampoule', pack: 5, packSize: 10, totalQuantity: 50, units: 'Inj', preferredSupplier: 'Luna s Apothecary', currency: 'AUD', itemManufacturer: 'Constar, Australia', quotedPrice: 14.81, quotedPackSize: 10, netCost: 14.81, adjCost: 14.81, priceExtension: 74.06 },
  { itemName: 'Bisoprolol fumarate - Tab 10 mg', pack: 5, packSize: 90, totalQuantity: 450, units: 'tab', preferredSupplier: 'Kahn Medicines', currency: 'USD', itemManufacturer: 'Arbor Pharmaceuticals, USA', quotedPrice: 1.22, quotedPackSize: 90, netCost: 1.94, adjCost: 1.94, priceExtension: 9.7 },
];

interface TenderAwardViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

export default function TenderAwardView({ navItems, onNavigate, tender, logoUrl }: TenderAwardViewProps) {
  const { t } = useTranslation();
  const stepStatus = getTenderSteps(tender.status).find((s) => s.key === 'award')?.status;
  const showEmpty = stepStatus === 'incomplete';
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [splashOpen, setSplashOpen] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredItems = useMemo(() => {
    let items = MOCK_AWARD_ITEMS.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.preferredSupplier.toLowerCase().includes(q) ||
        item.itemManufacturer.toLowerCase().includes(q)
      );
    });
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const av = a[sortKey as keyof AwardItem];
        const bv = b[sortKey as keyof AwardItem];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return items;
  }, [searchQuery, sortKey, sortDir]);

  const columns = [
    { key: 'itemName', label: t('tenderAward.itemName'), minWidth: 200 },
    { key: 'pack', label: t('tenderAward.pack') },
    { key: 'packSize', label: t('tenderAward.packSize') },
    { key: 'totalQuantity', label: t('tenderAward.totalQuantity') },
    { key: 'units', label: t('tenderAward.units') },
    { key: 'preferredSupplier', label: t('tenderAward.preferredSupplier'), minWidth: 140 },
    { key: 'currency', label: t('tenderAward.currency') },
    { key: 'itemManufacturer', label: t('tenderAward.itemManufacturer'), minWidth: 180 },
    { key: 'quotedPrice', label: t('tenderAward.quotedPrice') },
    { key: 'quotedPackSize', label: t('tenderAward.quotedPackSize') },
    { key: 'netCost', label: t('tenderAward.netCost') },
    { key: 'adjCost', label: t('tenderAward.adjCost') },
    { key: 'priceExtension', label: t('tenderAward.priceExtension') },
  ];

  const formatCurrency = (value: number | null) => {
    if (value == null) return '';
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="award" onNavigate={onNavigate} />,
        onBack: () => onNavigate('/tenders/detail'),
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
      {showEmpty ? (
        <EmptyStateView
          description={t('emptyState.awardDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/tenders/detail')}
        />
      ) : (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Info Banner */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            px: 3,
            py: 2,
            mt: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HugeiconsIcon icon={NoteIcon} size={24} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary', whiteSpace: 'nowrap' }}>
              {t('tenderAward.itemsAwarded', { items: 280, suppliers: 6 })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setSplashOpen(true)}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRadius: '24px',
              px: 3,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': { bgcolor: primaryColor, filter: 'brightness(1.1)', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
            }}
          >
            {t('tenderAward.finaliseTender')}
          </Button>
        </Box>

        {/* Toolbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <HugeiconsIcon icon={EyeIcon} size={20} />
              </IconButton>
            </Box>
            <InputBase
              placeholder={t('tenderAward.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <HugeiconsIcon icon={Search01Icon} size={18} />
                </InputAdornment>
              }
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '8px',
                height: 36,
                width: 200,
                px: 1.5,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: 'text.primary',
                '& .MuiInputAdornment-root': { color: 'text.secondary' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: 'text.secondary' }}>
              {t('tenderAward.showAll')}
            </Typography>
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
          </Box>
        </Box>

        {/* Data Table */}
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: '10px',
          overflow: 'auto',
          flex: 1,
          minHeight: 0,
          '&::-webkit-scrollbar': { height: 8, width: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: 'action.hover', borderRadius: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'text.disabled', borderRadius: 4 },
          scrollbarColor: (t: any) => `${t.palette.text.disabled} ${t.palette.action.hover}`,
          scrollbarWidth: 'thin',
        }}>
          <TableContainer>
            <Table size="small" sx={{ fontFamily: 'Inter, sans-serif', '& .MuiTableCell-root': { px: '10px' } }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                    <Checkbox size="small" icon={<ThinCheckboxIcon />} sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'text.secondary',
                        lineHeight: '16px',
                        verticalAlign: 'bottom',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: '10px',
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'normal',
                        ...(col.minWidth && { minWidth: col.minWidth }),
                      }}
                    >
                      <TableSortLabel
                        active={sortKey === col.key}
                        direction={sortKey === col.key ? sortDir : 'asc'}
                        onClick={() => handleSort(col.key)}
                        sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', '&.Mui-active': { color: 'text.secondary' } }}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item, idx) => (
                  <TableRow key={idx} hover sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox" sx={{ py: '10px' }}>
                      <Checkbox
                        size="small"
                        icon={<ThinCheckboxIcon />}
                        checked={checkedRows.has(idx)}
                        sx={{ color: primaryColor, '&.Mui-checked': { color: primaryColor }, '& .MuiSvgIcon-root': { fontSize: 18 } }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckedRows((prev) => {
                            const next = new Set(prev);
                            if (next.has(idx)) next.delete(idx);
                            else next.add(idx);
                            return next;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.itemName}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.pack}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.packSize}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.totalQuantity}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.units}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', fontWeight: 500 }}>
                      {item.preferredSupplier}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.currency}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.itemManufacturer}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', textAlign: 'right' }}>
                      {formatCurrency(item.quotedPrice)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.quotedPackSize}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', textAlign: 'right' }}>
                      {formatCurrency(item.netCost)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', textAlign: 'right' }}>
                      {formatCurrency(item.adjCost)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', textAlign: 'right', fontWeight: 500 }}>
                      {formatCurrency(item.priceExtension)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
        </>
      )}

      <FinaliseSplash
        open={splashOpen}
        onComplete={() => {
          setSplashOpen(false);
          onNavigate('/tenders');
        }}
      />
    </NavLayout>
  );
}
