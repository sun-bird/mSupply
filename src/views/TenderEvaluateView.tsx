import {
  ArrowDown01Icon,
  EyeIcon,
  HelpCircleIcon,
  CheckListIcon,
  PrinterIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  alpha,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import EmptyStateView from '../components/EmptyStateView';
import { getTenderSteps } from '../components/tender/tender.types';
import type { NavItem } from '../components/nav-layout';
import StatusController from '../components/tender/StatusController';
import EvaluateItemDialog, {
  type EvaluateItemSummary,
  type SupplierBid,
} from '../components/tender/EvaluateItemDialog';
import { daysUntil, parseDeadline } from '../components/tender/tenderDates';
import type { TenderRow } from './TendersView';

/** Mock supplier bids for the per-item evaluation modal — five bids per
 *  item, mirroring the Figma sample data. */
const MOCK_BIDS: SupplierBid[] = [
  { supplier: "Chloe's Consumables", manufacturer: 'Medica Pacifica - New Zealand', unitType: 'Cap', packSize: 90, packs: 5, totalUnits: 450, deliveryWeeks: 12, deliveryMode: 'ship', expiry: '05/13/2026', pricePerPack: 'FJD 25.00', priceLocal: 'NZD 18.50', status: 'Accept' },
  { supplier: "Chloe's Consumables", manufacturer: 'Medica Pacifica - New Zealand', unitType: 'Cap', packSize: 90, packs: 5, totalUnits: 450, deliveryWeeks: 2, deliveryMode: 'truck', expiry: '06/03/2026', pricePerPack: 'FJD 35.00', priceLocal: 'FJD 21.50', status: 'Preferred' },
  { supplier: "Luna's Apothecary Supplies", manufacturer: 'Biological Therapies, Australia', unitType: 'Pill', packSize: 50, packs: 5, totalUnits: 250, deliveryWeeks: 20, deliveryMode: 'ship', expiry: '05/31/2026', pricePerPack: 'FJD 24.00', priceLocal: 'SGD 14.00', status: 'Disqualify', hasComment: true },
  { supplier: "Lorenzo's POC Solutions", manufacturer: 'Abbott GmbH & Co.KG, Germany', unitType: 'Cap', packSize: 90, packs: 5, totalUnits: 450, deliveryWeeks: 8, deliveryMode: 'ship', expiry: '06/03/2026', pricePerPack: 'FJD 25.00', status: 'Accept' },
  { supplier: 'Sams Medical Department', manufacturer: 'Abbott, USA', unitType: 'Cap', packSize: 90, packs: 5, totalUnits: 450, deliveryWeeks: 14, deliveryMode: 'ship', expiry: '06/27/2026', pricePerPack: 'FJD 25.00', priceLocal: 'AUD 16.50', status: 'Accept' },
];

const ThinCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

interface EvalItem {
  itemNumber: string;
  itemCode: string;
  itemName: string;
  numberOfPacks: number;
  packSize: number;
  totalQuantity: number;
  suppliers: string;
  estimatedDelivery: string;
  totalCost: string;
  acceptableSuppliers: string;
  supplierSelected: boolean;
}

const MOCK_EVAL_ITEMS: EvalItem[] = [
  { itemNumber: '101', itemCode: 'M-002523', itemName: 'Acipimox - Cap 250 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '102', itemCode: 'M-003841', itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', numberOfPacks: 20, packSize: 25, totalQuantity: 500, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: false },
  { itemNumber: '103', itemCode: 'M-001297', itemName: 'Atorvastatin - Tab 10 mg', numberOfPacks: 15, packSize: 100, totalQuantity: 1500, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '104', itemCode: 'M-004510', itemName: 'Cilazapril - Tab 5 mg', numberOfPacks: 8, packSize: 30, totalQuantity: 240, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: false },
  { itemNumber: '105', itemCode: 'M-002198', itemName: 'Clonidine hydrochloride - Tab 25 mcg', numberOfPacks: 12, packSize: 60, totalQuantity: 720, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '106', itemCode: 'M-003672', itemName: 'Isosorbide mononitrate - Tab 20 mg', numberOfPacks: 25, packSize: 28, totalQuantity: 700, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: false },
  { itemNumber: '107', itemCode: 'M-005034', itemName: 'Omeprazole powder for oral suspension 2 mg per mL', numberOfPacks: 5, packSize: 90, totalQuantity: 450, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: false },
];

interface TenderEvaluateViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

export default function TenderEvaluateView({ navItems, onNavigate, tender, logoUrl }: TenderEvaluateViewProps) {
  const { t } = useTranslation();
  const stepStatus = getTenderSteps(tender.status).find((s) => s.key === 'evaluate')?.status;
  const showEmpty = stepStatus === 'incomplete';
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  // Evaluation unlocks once the bid deadline has passed — at that point
  // suppliers can no longer submit bids, so what's in is what's evaluable.
  const deadlineDate = parseDeadline(tender.deadline);
  const daysRemaining = deadlineDate ? daysUntil(deadlineDate) : null;
  const evaluationLocked = daysRemaining !== null && daysRemaining > 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Per-item evaluation modal — 1-based row index into the unfiltered
  // MOCK_EVAL_ITEMS list so prev/next walks the full set in original order.
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  // Which A/B variant to seed the dialog with — row clicks open A,
  // the banner's "Evaluate Bids" CTA opens directly into B.
  const [dialogVersion, setDialogVersion] = useState<'A' | 'B'>('A');
  const activeItem = activeItemIndex !== null ? MOCK_EVAL_ITEMS[activeItemIndex - 1] : null;
  const activeItemSummary: EvaluateItemSummary | null = activeItem
    ? {
        itemCode: activeItem.itemCode,
        itemName: activeItem.itemName,
        unitType: activeItem.suppliers || 'Cap',
        packSize: activeItem.packSize,
        numberOfPacks: activeItem.numberOfPacks,
        totalUnits: activeItem.totalQuantity,
      }
    : null;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredItems = useMemo(() => {
    let items = MOCK_EVAL_ITEMS.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        item.itemNumber.toLowerCase().includes(q)
      );
    });
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const av = a[sortKey as keyof EvalItem];
        const bv = b[sortKey as keyof EvalItem];
        const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return items;
  }, [searchQuery, sortKey, sortDir]);

  const columns = [
    { key: 'itemNumber', label: t('tenderEvaluate.itemNumber') },
    { key: 'itemCode', label: t('tenderEvaluate.itemCode'), minWidth: 100 },
    { key: 'itemName', label: t('tenderEvaluate.itemName'), minWidth: 200 },
    { key: 'numberOfPacks', label: t('tenderEvaluate.numberOfPacks'), minWidth: 115 },
    { key: 'packSize', label: t('tenderEvaluate.packSize') },
    { key: 'totalQuantity', label: t('tenderEvaluate.totalQuantity') },
    { key: 'suppliers', label: t('tenderEvaluate.suppliers') },
    { key: 'estimatedDelivery', label: t('tenderEvaluate.estimatedDelivery') },
    { key: 'totalCost', label: t('tenderEvaluate.totalCost') },
    { key: 'acceptableSuppliers', label: t('tenderEvaluate.acceptableSuppliers') },
    { key: 'supplierSelected', label: t('tenderEvaluate.supplierSelected'), minWidth: 110 },
  ];

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="evaluate" onNavigate={onNavigate} />,
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
          description={t('emptyState.evaluateDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/tenders/detail')}
        />
      ) : (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Info Banner — stacks vertically on mobile so the progress bar
            and CTA both have room without clipping the bid count text. */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            px: { xs: 2, sm: 3 },
            py: 2,
            mt: 2,
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minWidth: 0,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <HugeiconsIcon icon={CheckListIcon} size={24} color="#3E7BFA" />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary', whiteSpace: 'nowrap' }}>
              {t('tenderEvaluate.bidsReceived', { received: 14, total: 20 })}
            </Typography>
            <Box
              sx={{
                width: { xs: '100%', sm: 120 },
                height: 6,
                bgcolor: 'action.hover',
                borderRadius: 3,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Box sx={{ width: `${(14 / 20) * 100}%`, height: '100%', bgcolor: '#3E7BFA', borderRadius: 3 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            {daysRemaining !== null && (
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                {evaluationLocked
                  ? t('tenderEvaluate.bidDeadlineIs', { date: tender.deadline })
                  : t('tenderEvaluate.biddingClosed', { date: tender.deadline })}
              </Typography>
            )}
            <Button
              variant="contained"
              disabled={evaluationLocked}
              onClick={() => {
                setDialogVersion('A');
                setActiveItemIndex(1);
              }}
              sx={{
                bgcolor: '#3E7BFA',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '24px',
                px: 3,
                py: 0.75,
                width: { xs: '100%', sm: 'auto' },
                boxShadow: 'none',
                '&:hover': { bgcolor: '#3E7BFA', filter: 'brightness(1.1)', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              {t('tenderEvaluate.evaluateBids')}
            </Button>
          </Box>
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
              placeholder={t('tenderEvaluate.search')}
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
              {t('tenderEvaluate.showAll')}
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
                    <Checkbox size="small" icon={<ThinCheckboxIcon />} sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
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
                  <TableRow
                    key={idx}
                    hover
                    onClick={() => {
                      const fullIdx = MOCK_EVAL_ITEMS.indexOf(item);
                      setDialogVersion('A');
                      setActiveItemIndex(fullIdx >= 0 ? fullIdx + 1 : 1);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" sx={{ py: '10px' }} onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        icon={<ThinCheckboxIcon />}
                        checked={checkedRows.has(idx)}
                        sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }}
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
                      {item.itemNumber}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.itemCode}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.itemName}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.numberOfPacks}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.packSize}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.totalQuantity}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.suppliers}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: 'Inter, sans-serif', py: '10px', color: 'text.disabled' }}>
                      {item.estimatedDelivery || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: 'Inter, sans-serif', py: '10px', color: item.totalCost ? 'text.primary' : 'text.disabled' }}>
                      {item.totalCost || 'N/A'}
                    </TableCell>
                    {(() => {
                      // Count of bids on this item with an "acceptable"
                      // status (Accept or Preferred). Falls back to N/A
                      // if the item hasn't been evaluated yet.
                      const acceptCount = item.supplierSelected
                        ? MOCK_BIDS.filter((b) => b.status === 'Accept' || b.status === 'Preferred').length
                        : null;
                      return (
                        <TableCell sx={{ fontSize: 12, fontFamily: 'Inter, sans-serif', py: '10px', color: acceptCount !== null ? 'text.primary' : 'text.disabled' }}>
                          {acceptCount !== null ? acceptCount : 'N/A'}
                        </TableCell>
                      );
                    })()}
                    <TableCell sx={{ py: '10px' }}>
                      <Chip
                        label={item.supplierSelected ? 'Evaluated' : 'Not Evaluated'}
                        size="small"
                        sx={
                          item.supplierSelected
                            ? {
                                bgcolor: alpha(primaryColor, 0.06),
                                color: 'primary.main',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: 11,
                                height: 20,
                                borderRadius: '100px',
                                '& .MuiChip-label': { px: 1 },
                              }
                            : {
                                bgcolor: 'rgba(28,28,40,0.06)',
                                color: '#555770',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: 11,
                                height: 20,
                                borderRadius: '100px',
                                '& .MuiChip-label': { px: 1 },
                              }
                        }
                      />
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

      <EvaluateItemDialog
        open={activeItemIndex !== null}
        tenderTitle={`${tender.serial} ${tender.description}`}
        index={activeItemIndex ?? 0}
        total={MOCK_EVAL_ITEMS.length}
        item={activeItemSummary}
        bids={MOCK_BIDS}
        initialVersion={dialogVersion}
        onClose={() => setActiveItemIndex(null)}
        onPrev={() => setActiveItemIndex((i) => (i && i > 1 ? i - 1 : i))}
        onNext={() =>
          setActiveItemIndex((i) =>
            i && i < MOCK_EVAL_ITEMS.length ? i + 1 : i
          )
        }
      />
    </NavLayout>
  );
}
