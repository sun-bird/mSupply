import {
  AddCircleIcon,
  ArrowDown01Icon,
  EyeIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
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
import { getTenderSteps } from '../components/tender/tender.types';

const ThinCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);
import type { NavItem } from '../components/nav-layout';
import StatusController from '../components/tender/StatusController';
import type { TenderRow } from './TendersView';

interface TenderItem {
  itemNumber: string;
  itemCode: string;
  itemName: string;
  numberOfPacks: number;
  packSize: number;
  totalQuantity: number;
  unitType: number;
  productSpecifications: string;
  conditions: string;
}

const MOCK_ITEMS: TenderItem[] = [
  { itemNumber: '101', itemCode: 'M-002523', itemName: 'Acipimox - Cap 250 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 28, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '102', itemCode: 'M-003841', itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', numberOfPacks: 20, packSize: 25, totalQuantity: 500, unitType: 14, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '103', itemCode: 'M-001297', itemName: 'Atorvastatin - Tab 10 mg', numberOfPacks: 15, packSize: 100, totalQuantity: 1500, unitType: 30, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '104', itemCode: 'M-004510', itemName: 'Cilazapril - Tab 5 mg', numberOfPacks: 8, packSize: 30, totalQuantity: 240, unitType: 28, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '105', itemCode: 'M-002198', itemName: 'Clonidine hydrochloride - Tab 25 mcg', numberOfPacks: 12, packSize: 60, totalQuantity: 720, unitType: 56, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '106', itemCode: 'M-003672', itemName: 'Isosorbide mononitrate - Tab 20 mg', numberOfPacks: 25, packSize: 28, totalQuantity: 700, unitType: 30, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '107', itemCode: 'M-005034', itemName: 'Omeprazole powder for oral suspension 2 mg per mL', numberOfPacks: 5, packSize: 90, totalQuantity: 450, unitType: 7, productSpecifications: 'Abc', conditions: 'Abc' },
];

interface TenderItemsViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

export default function TenderItemsView({ navItems, onNavigate, tender, logoUrl }: TenderItemsViewProps) {
  const { t } = useTranslation();
  const stepStatus = getTenderSteps(tender.status).find((s) => s.key === 'items')?.status;
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
    let items = MOCK_ITEMS.filter((item) => {
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
        const av = a[sortKey as keyof TenderItem];
        const bv = b[sortKey as keyof TenderItem];
        const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return items;
  }, [searchQuery, sortKey, sortDir]);

  const columns = [
    { key: 'itemNumber', label: t('tenderItems.itemNumber') },
    { key: 'itemCode', label: t('tenderItems.itemCode'), minWidth: 100 },
    { key: 'itemName', label: t('tenderItems.itemName'), minWidth: 200 },
    { key: 'numberOfPacks', label: t('tenderItems.numberOfPacks'), minWidth: 115 },
    { key: 'packSize', label: t('tenderItems.packSize') },
    { key: 'totalQuantity', label: t('tenderItems.totalQuantity') },
    { key: 'unitType', label: t('tenderItems.unitType') },
    { key: 'productSpecifications', label: t('tenderItems.productSpecifications') },
    { key: 'conditions', label: t('tenderItems.conditions') },
  ];

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="items" onNavigate={onNavigate} />,
        onBack: () => onNavigate('/tenders/detail'),
        primaryAction: {
          label: t('tenderItems.addItems'),
          icon: <HugeiconsIcon icon={AddCircleIcon} size={18} color={primaryColor} />,
          onClick: () => {},
        },
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
          description={t('emptyState.itemsDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/tenders/detail')}
        />
      ) : (
        <>
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
            placeholder={t('tenderItems.search')}
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
            {t('tenderItems.showAll')}
          </Typography>
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
        </Box>
      </Box>

      {/* Data Table */}
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: '10px',
        overflow: 'auto',
        '&::-webkit-scrollbar': { height: 8, width: 8 },
        '&::-webkit-scrollbar-track': { bgcolor: 'action.hover', borderRadius: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'text.disabled', borderRadius: 4 },
        scrollbarColor: (t: any) => `${t.palette.text.disabled} ${t.palette.action.hover}`,
        scrollbarWidth: 'thin',
      }}>
        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif', '& .MuiTableCell-root': { px: '5px' } }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                  <Checkbox size="small" icon={<ThinCheckboxIcon />} sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                </TableCell>
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: '10px' }} />
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
                {/* Notes column */}
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: '10px' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, idx) => (
                <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell padding="checkbox" sx={{ py: '10px' }}>
                    <Checkbox
                      size="small"
                      icon={<ThinCheckboxIcon />}
                      checked={checkedRows.has(idx)}
                      onChange={() => setCheckedRows((prev) => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; })}
                      sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: '10px', width: 40 }}>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                    </IconButton>
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
                    {item.unitType}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                    {item.productSpecifications}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                    {item.conditions}
                  </TableCell>
                  <TableCell sx={{ py: '10px', width: 40 }}>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <HugeiconsIcon icon={NoteIcon} size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredItems.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: 'text.secondary', fontFamily: 'Inter, sans-serif' }}>
              No items found.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Next Button */}
      <Box sx={{ position: 'fixed', bottom: 96, left: 220, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
        <Button
          variant="contained"
          onClick={() => onNavigate('/tenders/detail')}
          sx={{
            bgcolor: primaryColor,
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '24px',
            px: 5,
            py: 1,
            boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: primaryColor,
              filter: 'brightness(1.15)',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {t('tenderItems.next')}
        </Button>
      </Box>
        </>
      )}
    </NavLayout>
  );
}
