import {
  ArrowDown01Icon,
  EyeIcon,
  FileEditIcon,
  HelpCircleIcon,
  NoteIcon,
  PrinterIcon,
  Search01Icon,
  Tick02Icon,
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
import { getTenderSteps } from '../components/tender/tender.types';
import type { NavItem } from '../components/nav-layout';
import StatusController from '../components/tender/StatusController';
import type { TenderRow } from './TendersView';

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
  { itemNumber: '102', itemCode: 'M-003841', itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', numberOfPacks: 20, packSize: 25, totalQuantity: 500, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '103', itemCode: 'M-001297', itemName: 'Atorvastatin - Tab 10 mg', numberOfPacks: 15, packSize: 100, totalQuantity: 1500, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '104', itemCode: 'M-004510', itemName: 'Cilazapril - Tab 5 mg', numberOfPacks: 8, packSize: 30, totalQuantity: 240, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '105', itemCode: 'M-002198', itemName: 'Clonidine hydrochloride - Tab 25 mcg', numberOfPacks: 12, packSize: 60, totalQuantity: 720, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '106', itemCode: 'M-003672', itemName: 'Isosorbide mononitrate - Tab 20 mg', numberOfPacks: 25, packSize: 28, totalQuantity: 700, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
  { itemNumber: '107', itemCode: 'M-005034', itemName: 'Omeprazole powder for oral suspension 2 mg per mL', numberOfPacks: 5, packSize: 90, totalQuantity: 450, suppliers: 'Cap', estimatedDelivery: '', totalCost: '', acceptableSuppliers: '', supplierSelected: true },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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
    { key: 'supplierSelected', label: t('tenderEvaluate.supplierSelected') },
  ];

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="evaluate" onNavigate={onNavigate} />,
        onBack: () => onNavigate('/replenishment/tenders/detail'),
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
          icon={FileEditIcon}
          description={t('emptyState.evaluateDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/replenishment/tenders/detail')}
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
            <HugeiconsIcon icon={NoteIcon} size={24} color="#3E7BFA" />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary', whiteSpace: 'nowrap' }}>
              {t('tenderEvaluate.bidsReceived', { received: 14, total: 20 })}
            </Typography>
            <Box sx={{ width: 120, height: 6, bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              <Box sx={{ width: `${(14 / 20) * 100}%`, height: '100%', bgcolor: '#3E7BFA', borderRadius: 3 }} />
            </Box>
          </Box>
          <Button
            variant="contained"
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
              boxShadow: 'none',
              '&:hover': { bgcolor: '#3E7BFA', filter: 'brightness(1.1)', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
            }}
          >
            {t('tenderEvaluate.evaluateBids')}
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
                  <TableRow key={idx} hover sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox" sx={{ py: '10px' }}>
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
                      {item.estimatedDelivery || t('tenderEvaluate.notEvaluated')}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.totalCost}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {item.acceptableSuppliers}
                    </TableCell>
                    <TableCell sx={{ py: '10px', textAlign: 'center' }}>
                      {item.supplierSelected && (
                        <HugeiconsIcon icon={Tick02Icon} size={18} color={primaryColor} />
                      )}
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
    </NavLayout>
  );
}
