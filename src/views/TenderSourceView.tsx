import {
  AddCircleIcon,
  ArrowDown01Icon,
  Comment01Icon,
  EyeIcon,
  HelpCircleIcon,
  Mail01Icon,
  NoteIcon,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ThinCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);
import { NavLayout } from '../components/nav-layout';
import EmptyStateView from '../components/EmptyStateView';
import { getTenderSteps } from '../components/tender/tender.types';
import type { NavItem } from '../components/nav-layout';
import StatusController from '../components/tender/StatusController';
import SupplierSidebar from '../components/tender/SupplierSidebar';
import type { Supplier } from '../components/tender/SupplierSidebar';
import { TENDER_SUPPLIERS } from '../components/tender/tenderSuppliers';
import type { TenderRow } from './TendersView';

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

/** Parse a `D/M/YYYY` date string (matches the format on TenderRow.deadline)
 *  into a Date in local time, or `null` if the input is malformed. */
function parseDeadline(value: string): Date | null {
  const parts = value.split('/').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

/** Whole-day difference between `deadline` and today. Positive = future. */
function daysUntil(deadline: Date): number {
  const MS_PER_DAY = 86_400_000;
  const today = new Date();
  const a = Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a - b) / MS_PER_DAY);
}

export default function TenderSourceView({ navItems, onNavigate, tender, logoUrl }: TenderSourceViewProps) {
  const { t } = useTranslation();
  const stepStatus = getTenderSteps(tender.status).find((s) => s.key === 'source')?.status;
  const showEmpty = stepStatus === 'incomplete';
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const deadlineDate = parseDeadline(tender.deadline);
  const daysRemaining = deadlineDate ? daysUntil(deadlineDate) : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [checkedCodes, setCheckedCodes] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [comments, setComments] = useState<Record<string, string>>(() =>
    Object.fromEntries(TENDER_SUPPLIERS.map((s) => [s.code, s.comment]))
  );

  // Refs used to dismiss the supplier sidebar on outside-clicks. The table is
  // excluded so clicking another row continues to *switch* the sidebar to
  // that supplier rather than closing it.
  const sidebarWrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Bumped each time the user clicks the in-row comment icon so the sidebar
  // re-runs its highlight effect (force-open Comments, scroll, focus, flash)
  // even when the same supplier is already selected.
  const [commentHighlightKey, setCommentHighlightKey] = useState(0);

  useEffect(() => {
    if (!selectedSupplier) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (sidebarWrapperRef.current?.contains(target)) return;
      if (tableRef.current?.contains(target)) return;
      setSelectedSupplier(null);
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [selectedSupplier]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredSuppliers = useMemo(() => {
    let result = TENDER_SUPPLIERS.filter((s) => {
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
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="source" onNavigate={onNavigate} />,
        onBack: () => onNavigate('/tenders/detail'),
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
      {showEmpty ? (
        <EmptyStateView
          description={t('emptyState.sourceDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/tenders/detail')}
        />
      ) : (
        <>
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Info Banner — counts how many invited suppliers have replied. */}
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
              <HugeiconsIcon icon={NoteIcon} size={24} color="#3E7BFA" />
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary', whiteSpace: 'nowrap' }}>
                {t('tenderSource.suppliersResponded', {
                  responded: TENDER_SUPPLIERS.filter((s) => s.dateResponded).length,
                  total: TENDER_SUPPLIERS.length,
                })}
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
                <Box
                  sx={{
                    width: `${
                      (TENDER_SUPPLIERS.filter((s) => s.dateResponded).length /
                        Math.max(TENDER_SUPPLIERS.length, 1)) *
                      100
                    }%`,
                    height: '100%',
                    bgcolor: '#3E7BFA',
                    borderRadius: 3,
                  }}
                />
              </Box>
              {daysRemaining !== null && (
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, whiteSpace: 'nowrap' }}>
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: 'text.secondary',
                    }}
                  >
                    {tender.deadline}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: 'text.disabled',
                    }}
                  >
                    ·
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      fontWeight: 500,
                      color: daysRemaining < 0
                        ? 'error.main'
                        : daysRemaining <= 7
                          ? 'warning.main'
                          : 'text.secondary',
                    }}
                  >
                    {daysRemaining > 0
                      ? t('tenderSource.daysToDeadline', { count: daysRemaining })
                      : daysRemaining === 0
                        ? t('tenderSource.deadlineToday')
                        : t('tenderSource.deadlineOverdue', { count: Math.abs(daysRemaining) })}
                  </Typography>
                </Box>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={() => onNavigate('/tenders/evaluate')}
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
              }}
            >
              {t('tenderSource.evaluateBids')}
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
            <TableContainer ref={tableRef}>
              <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
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
                            icon={<ThinCheckboxIcon />}
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
                            <IconButton
                              size="small"
                              aria-label="View comment"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSupplier(supplier);
                                setCommentHighlightKey((k) => k + 1);
                              }}
                              sx={{ color: 'text.secondary', p: 0.5 }}
                            >
                              <HugeiconsIcon icon={Comment01Icon} size={16} color={theme.palette.text.secondary} />
                            </IconButton>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Bottom Actions — fixed CTA row. On desktop the row sits centered
              within the content area (offset 220px to clear the nav drawer);
              on mobile the drawer is hidden so the row spans the full width
              and the buttons stack to keep their labels readable. */}
          <Box
            sx={{
              position: 'fixed',
              bottom: { xs: 76, sm: 96 },
              left: { xs: 16, md: 220 },
              right: { xs: 16, md: 0 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1, sm: 2 },
              zIndex: 5,
            }}
          >
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
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: 'none', sm: 260, md: 'none' },
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
          <Box ref={sidebarWrapperRef}>
            <SupplierSidebar
              supplier={{ ...selectedSupplier, comment: comments[selectedSupplier.code] ?? '' }}
              onCommentChange={(code, comment) => setComments((prev) => ({ ...prev, [code]: comment }))}
              onClose={() => setSelectedSupplier(null)}
              highlightCommentsKey={commentHighlightKey}
            />
          </Box>
        )}
      </Box>
        </>
      )}
    </NavLayout>
  );
}
