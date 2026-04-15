import {
  AddCircleIcon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  CircleIcon,
  Comment01Icon,
  EyeIcon,
  HelpCircleIcon,
  Mail01Icon,
  PrinterIcon,
  Search01Icon,
  Upload04Icon,
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
import SupplierSidebar from '../components/tender/SupplierSidebar';
import type { Supplier } from '../components/tender/SupplierSidebar';
import type { TenderRow } from './TendersView';

const MOCK_SUPPLIERS: Supplier[] = [
  { code: 'CC', name: "Chloe's Consumables", performance: 100, dateSent: '12/02/2026', dateResponded: '18/02/2026', totalBid: '514.00', tenderValue: 489.30, totalOnPO: 372.50, checked: true, pastBids: 14, tendersWon: 5, deliveryOnTime: 100, comment: "Chloe's have been great to deal with. They were responsive when we had questions about delivery and suppliers were well packed and arrived on time." },
  { code: 'KS2', name: "Luna's Apothecary Consumable Supplies", performance: 100, dateSent: '14/02/2026', dateResponded: '25/02/2026', totalBid: '1,247.80', tenderValue: 1105.60, totalOnPO: 863.20, checked: true, pastBids: 14, tendersWon: 5, deliveryOnTime: 100, comment: "Luna's have been great to deal with. They were responsive when we had questions about delivery and suppliers were well packed and arrived on time." },
  { code: 'X454', name: 'Kahn Medical Equipment', performance: 89, dateSent: '12/02/2026', dateResponded: '03/03/2026', totalBid: '782.50', tenderValue: 695.00, totalOnPO: 410.75, checked: false, pastBids: 8, tendersWon: 2, deliveryOnTime: 89, comment: '' },
  { code: 'LPOC', name: "Lorenzo's POC Solutions", performance: 87, dateSent: '15/02/2026', dateResponded: '22/02/2026', totalBid: '623.40', tenderValue: 580.15, totalOnPO: 290.00, checked: true, pastBids: 11, tendersWon: 4, deliveryOnTime: 87, comment: '' },
  { code: 'TSS', name: 'The Supply Shack', performance: 64, dateSent: '12/02/2026', dateResponded: '10/03/2026', totalBid: '1,890.00', tenderValue: 1742.25, totalOnPO: 526.40, checked: false, pastBids: 6, tendersWon: 1, deliveryOnTime: 64, comment: '' },
];

function perfColor(value: number): string {
  if (value >= 95) return '#05A660';
  if (value >= 70) return '#FDAC42';
  return '#E53535';
}

interface TenderSourceViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

export default function TenderSourceView({ navItems, onNavigate, tender, logoUrl }: TenderSourceViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [checkedCodes, setCheckedCodes] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [comments, setComments] = useState<Record<string, string>>(() =>
    Object.fromEntries(MOCK_SUPPLIERS.map((s) => [s.code, s.comment]))
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredSuppliers = useMemo(() => {
    let result = MOCK_SUPPLIERS.filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    });
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey as keyof Supplier];
        const bv = b[sortKey as keyof Supplier];
        const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [searchQuery, sortKey, sortDir]);

  const columns = [
    { key: 'code', label: t('tenderSource.code') },
    { key: 'name', label: t('tenderSource.supplierName'), minWidth: 200 },
    { key: 'performance', label: t('tenderSource.performance') },
    { key: 'dateSent', label: t('tenderSource.dateSent') },
    { key: 'dateResponded', label: t('tenderSource.dateResponded') },
    { key: 'totalBid', label: t('tenderSource.totalBid') },
    { key: 'tenderValue', label: t('tenderSource.tenderValue') },
    { key: 'totalOnPO', label: t('tenderSource.totalOnPO') },
  ];

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 2 }}>
            {(['plan', 'items', 'source', 'evaluate', 'award'] as const).map((step, i, steps) => {
              const stepRoutes: Record<string, string> = {
                plan: '/replenishment/tenders/plan',
                items: '/replenishment/tenders/items',
                source: '/replenishment/tenders/source',
                evaluate: '/replenishment/tenders/evaluate',
              };
              const activeIndex = steps.indexOf('source');
              const isActive = step === 'source';
              const isCompleted = i < activeIndex;
              const isNavigable = step in stepRoutes;
              const color = isActive ? primaryColor : theme.palette.text.secondary;
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
          label: t('tenderSource.addSupplier'),
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
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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
                placeholder={t('tenderSource.search')}
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
                {t('tenderSource.showAll')}
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
              <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                      <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
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
                    <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: '10px' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSuppliers.map((supplier) => {
                    const isSelected = selectedSupplier?.code === supplier.code;
                    return (
                      <TableRow
                        key={supplier.code}
                        hover
                        selected={isSelected}
                        onClick={() => setSelectedSupplier(isSelected ? null : supplier)}
                        sx={{
                          cursor: 'pointer',
                          '&.Mui-selected': { bgcolor: 'rgba(62,123,250,0.08)' },
                          '&.Mui-selected:hover': { bgcolor: 'rgba(62,123,250,0.12)' },
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ py: '10px' }}>
                          <Checkbox
                            size="small"
                            checked={checkedCodes.has(supplier.code)}
                            sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCheckedCodes((prev) => {
                                const next = new Set(prev);
                                if (next.has(supplier.code)) next.delete(supplier.code);
                                else next.add(supplier.code);
                                return next;
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                          {supplier.code}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                          {supplier.name}
                        </TableCell>
                        <TableCell sx={{ py: '10px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: perfColor(supplier.performance) }} />
                            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary' }}>
                              {supplier.performance}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                          {supplier.dateSent}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                          {supplier.dateResponded}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                          {supplier.totalBid}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                          {supplier.tenderValue}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                          {supplier.totalOnPO}
                        </TableCell>
                        <TableCell sx={{ py: '10px', textAlign: 'center', width: 40 }}>
                          {(comments[supplier.code] || supplier.comment) ? (
                            <HugeiconsIcon icon={Comment01Icon} size={16} color={theme.palette.text.secondary} />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Bottom Actions */}
          <Box sx={{ position: 'fixed', bottom: 96, left: 220, right: 0, display: 'flex', justifyContent: 'center', gap: 2, zIndex: 5 }}>
            {[
              { icon: Mail01Icon, label: t('tenderSource.emailToSelected') },
              { icon: Upload04Icon, label: t('tenderSource.uploadToHub') },
            ].map((action) => (
              <Button
                key={action.label}
                variant="contained"
                startIcon={<HugeiconsIcon icon={action.icon} size={18} />}
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: 180, sm: 260, md: 'none' },
                  minWidth: 0,
                  '& .MuiButton-startIcon': { flexShrink: 0 },
                  '&:hover': { bgcolor: primaryColor, boxShadow: '0px 2px 8px rgba(0,0,0,0.15)', filter: 'brightness(1.15)' },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Sidebar */}
        {selectedSupplier && (
          <SupplierSidebar
            supplier={{ ...selectedSupplier, comment: comments[selectedSupplier.code] ?? '' }}
            onCommentChange={(code, comment) => setComments((prev) => ({ ...prev, [code]: comment }))}
          />
        )}
      </Box>
    </NavLayout>
  );
}
