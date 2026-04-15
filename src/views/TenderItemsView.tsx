import {
  AddCircleIcon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  CircleIcon,
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
import type { NavItem } from '../components/nav-layout';
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
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Acipimox - Cap 250 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Atorvastatin - Tab 10 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Cilazapril - Tab 5 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Clonidine hydrochloride - Tab 25 mcg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Isosorbide mononitrate - Tab 20 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '123', itemCode: 'M-002523', itemName: 'Omeprazole powder for oral suspension 2 mg per mL', numberOfPacks: 5, packSize: 90, totalQuantity: 450, unitType: 90, productSpecifications: 'Abc', conditions: 'Abc' },
];

interface TenderItemsViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
}

export default function TenderItemsView({ navItems, onNavigate, tender }: TenderItemsViewProps) {
  const { t } = useTranslation();
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
    { key: 'itemCode', label: t('tenderItems.itemCode') },
    { key: 'itemName', label: t('tenderItems.itemName'), minWidth: 200 },
    { key: 'numberOfPacks', label: t('tenderItems.numberOfPacks') },
    { key: 'packSize', label: t('tenderItems.packSize') },
    { key: 'totalQuantity', label: t('tenderItems.totalQuantity') },
    { key: 'unitType', label: t('tenderItems.unitType') },
    { key: 'productSpecifications', label: t('tenderItems.productSpecifications') },
    { key: 'conditions', label: t('tenderItems.conditions') },
  ];

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 2 }}>
            {(['plan', 'items', 'source', 'evaluate', 'award'] as const).map((step, i, steps) => {
              const stepRoutes: Record<string, string> = {
                plan: '/replenishment/tenders/plan',
                items: '/replenishment/tenders/items',
                source: '/replenishment/tenders/source',
              };
              const activeIndex = steps.indexOf('items');
              const isActive = step === 'items';
              const isCompleted = i < activeIndex;
              const isNavigable = step in stepRoutes;
              const color = isActive ? primaryColor : '#555770';
              return (
                <Box
                  key={step}
                  onClick={isNavigable && !isActive ? () => onNavigate(stepRoutes[step]) : undefined}
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
        ),
        onBack: () => onNavigate('/replenishment/tenders/detail'),
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
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '10px' }}>
        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                  <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
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
      <Box sx={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', display: 'flex', zIndex: 5 }}>
        <Button
          variant="contained"
          onClick={() => onNavigate('/replenishment/tenders/detail')}
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
            '&:hover': {
              bgcolor: primaryColor,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            },
          }}
        >
          {t('tenderItems.next')}
        </Button>
      </Box>
    </NavLayout>
  );
}
