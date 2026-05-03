import {
  AddCircleIcon,
  ArrowDown01Icon,
  EyeIcon,
  HelpCircleIcon,
  PrinterIcon,
  Search01Icon,
  Settings04Icon,
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
  MenuItem,
  Popover,
  Select,
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
import type { NavItem } from '../components/nav-layout';
import DateInput from '../components/tender/DateInput';

/** Parse a `D/M/YYYY` date string into a local-time Date, or `null` for
 *  malformed input. Mirrors the helper used elsewhere in the tender views. */
function parseDmy(value: string): Date | null {
  const parts = value.split('/').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

const ThinCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

export interface TenderRow {
  serial: string;
  status: string;
  method: string;
  type: string;
  description: string;
  reference: string;
  created: string;
  advertised: string;
  deadline: string;
  expires: string;
  // Optional Tender Details fields. Captured by the New Tender form and
  // editable on the Plan view; absent on the original seed rows.
  incoterm?: string;
  workflow?: string;
  category?: string;
  tenderPeriod?: string;
  notes?: string;
}

const statusColors: Record<string, { dot: string; bg: string }> = {
  Planning: { dot: '#8E8EA9', bg: 'rgba(142,142,169,0.15)' },
  Advertised: { dot: '#FDAC42', bg: 'rgba(253,172,66,0.2)' },
  Evaluation: { dot: '#3E7BFA', bg: 'rgba(62,123,250,0.15)' },
  Award: { dot: '#05A660', bg: 'rgba(5,166,96,0.2)' },
  Finalised: { dot: '#3E7BFA', bg: 'rgba(62,123,250,0.1)' },
};

interface TendersViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  onSelectTender: (tender: TenderRow) => void;
  /** Live list of tenders. Owned by App so edits in a tender's plan view
   *  flow back into this list. */
  tenders: TenderRow[];
  logoUrl?: string;
}

export default function TendersView({ navItems, onNavigate, onSelectTender, tenders, logoUrl }: TendersViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [activeFilter, setActiveFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Filter dropdown — opens a Popover anchored to the "Show All" trigger.
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  // Date range filter (deadline-based). ISO strings (`YYYY-MM-DD`) so they
  // pair directly with the DateInput component.
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const dateFromMs = dateFrom ? parseDmy(dateFrom.split('-').reverse().join('/'))?.getTime() ?? null : null;
  const dateToMs = dateTo ? parseDmy(dateTo.split('-').reverse().join('/'))?.getTime() ?? null : null;
  const filtersActive = activeFilter !== 'active' || !!dateFrom || !!dateTo;
  const activeFilterCount = (activeFilter !== 'active' ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const clearFilters = () => {
    setActiveFilter('active');
    setDateFrom('');
    setDateTo('');
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const statusFilters = [
    { key: 'active', label: t('tenders.activeTenders'), count: tenders.length },
    { key: 'Planning', label: t('tenders.planning'), count: tenders.filter((r) => r.status === 'Planning').length },
    { key: 'Advertised', label: t('tenders.advertised'), count: tenders.filter((r) => r.status === 'Advertised').length },
    { key: 'Evaluation', label: t('tenders.evaluation'), count: tenders.filter((r) => r.status === 'Evaluation').length },
    { key: 'Award', label: t('tenders.award'), count: tenders.filter((r) => r.status === 'Award').length },
    { key: 'Finalised', label: t('tenders.finalised'), count: tenders.filter((r) => r.status === 'Finalised').length },
  ];

  const filteredRows = useMemo(() => {
    let result = tenders.filter((row) => {
      const matchesStatus = activeFilter === 'active' || row.status === activeFilter;
      if (!matchesStatus) return false;

      // Deadline-based date range.
      if (dateFromMs !== null || dateToMs !== null) {
        const deadlineMs = parseDmy(row.deadline)?.getTime();
        if (deadlineMs == null) return false;
        if (dateFromMs !== null && deadlineMs < dateFromMs) return false;
        if (dateToMs !== null && deadlineMs > dateToMs) return false;
      }

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        row.serial.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.method.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.reference.toLowerCase().includes(q)
      );
    });
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey as keyof TenderRow];
        const bv = b[sortKey as keyof TenderRow];
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [tenders, activeFilter, searchQuery, sortKey, sortDir, dateFromMs, dateToMs]);

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: t('tenders.title'),
        onBack: () => onNavigate('/dashboard'),
        primaryAction: {
          label: t('tenders.newTender'),
          icon: <HugeiconsIcon icon={AddCircleIcon} size={18} color={primaryColor} />,
          onClick: () => onNavigate('/tenders/new'),
        },
        secondaryActions: [
          {
            label: t('tenders.tenderSettings'),
            icon: <HugeiconsIcon icon={Settings04Icon} size={18} color={primaryColor} />,
            onClick: () => {},
          },
        ],
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
      {/* Status Filter Cards */}
      <Box sx={{
        display: 'flex',
        gap: '10px',
        mb: 3,
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'action.hover', borderRadius: 3 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'text.disabled', borderRadius: 3 },
        scrollbarColor: (t: any) => `${t.palette.text.disabled} ${t.palette.action.hover}`,
        scrollbarWidth: 'thin',
      }}>
        {statusFilters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Box
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              sx={{
                minWidth: 120,
                height: 100,
                borderRadius: '10px',
                flexShrink: 0,
                bgcolor: isActive ? 'rgba(62,123,250,0.12)' : 'background.paper',
                border: isActive ? '2px solid #3E7BFA' : '1px solid',
                borderColor: isActive ? '#3E7BFA' : 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                px: '16px',
                py: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                  bgcolor: isActive ? 'rgba(62,123,250,0.18)' : 'action.hover',
                },
              }}
            >
              <Chip
                label={filter.label}
                size="small"
                sx={{
                  bgcolor: isActive
                    ? '#3E7BFA'
                    : statusColors[filter.key]?.bg ?? 'action.hover',
                  color: isActive ? '#FFFFFF' : 'text.primary',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  height: 22,
                  borderRadius: '100px',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 30,
                  lineHeight: '36px',
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                {filter.count}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Table Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
            placeholder={t('tenders.search')}
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
        <Box
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: filtersActive ? primaryColor : 'text.secondary',
            transition: 'color 0.15s',
            '&:hover': { color: primaryColor },
          }}
        >
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: 'inherit' }}>
            {filtersActive
              ? t('tenders.filtersApplied', { count: activeFilterCount })
              : t('tenders.showAll')}
          </Typography>
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} color="currentColor" />
        </Box>
      </Box>

      <Popover
        open={!!filterAnchor}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { borderRadius: '10px', mt: 0.5, p: 2, width: 320, display: 'flex', flexDirection: 'column', gap: 2 } } }}
      >
        <Box>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: 'text.secondary', mb: 0.75 }}>
            {t('tenders.filterStatusLabel')}
          </Typography>
          <Select
            size="small"
            fullWidth
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              '& .MuiSelect-select': { py: 0.75, paddingLeft: '12px' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
            IconComponent={() => (
              <Box sx={{ pr: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
              </Box>
            )}
          >
            {statusFilters.map((f) => (
              <MenuItem key={f.key} value={f.key} sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                {f.label} ({f.count})
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: 'text.secondary', mb: 0.75 }}>
            {t('tenders.filterDeadlineRange')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateInput
              value={dateFrom}
              onChange={setDateFrom}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '8px',
                px: 1.5,
                py: 0.75,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: dateFrom ? 'text.primary' : 'text.disabled',
                height: 36,
              }}
            />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'text.disabled', flexShrink: 0 }}>
              –
            </Typography>
            <DateInput
              value={dateTo}
              onChange={setDateTo}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '8px',
                px: 1.5,
                py: 0.75,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: dateTo ? 'text.primary' : 'text.disabled',
                height: 36,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
          <Button
            onClick={clearFilters}
            disabled={!filtersActive}
            sx={{
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
              fontSize: 13,
              color: 'text.secondary',
              '&:hover': { color: primaryColor, bgcolor: 'transparent' },
            }}
          >
            {t('tenders.filterClear')}
          </Button>
          <Button
            variant="contained"
            onClick={() => setFilterAnchor(null)}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '24px',
              boxShadow: 'none',
              '&:hover': { bgcolor: primaryColor, filter: 'brightness(1.1)', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
            }}
          >
            {t('tenders.filterDone')}
          </Button>
        </Box>
      </Popover>

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
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                  <Checkbox size="small" icon={<ThinCheckboxIcon />} sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                </TableCell>
                {([
                  { key: 'serial', label: t('tenders.serial') },
                  { key: 'status', label: t('tenders.status') },
                  // Method is always RFQ/RFT — clamp the column so the
                  // header doesn't reserve more width than the content.
                  { key: 'method', label: t('tenders.method'), width: 80 },
                  { key: 'type', label: t('tenders.type') },
                  { key: 'description', label: t('tenders.description'), minWidth: 160 },
                  { key: 'reference', label: t('tenders.reference') },
                  { key: 'created', label: t('tenders.created') },
                  { key: 'advertised', label: t('tenders.advertised') },
                  { key: 'deadline', label: t('tenders.deadline') },
                  { key: 'expires', label: t('tenders.expires') },
                ] as Array<{ key: string; label: string; minWidth?: number; width?: number }>).map((col) => (
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
                      ...(col.width && { width: col.width, maxWidth: col.width }),
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
              {filteredRows.map((row, idx) => {
                const sc = statusColors[row.status] ?? statusColors.Planning;
                return (
                  <TableRow
                    key={idx}
                    hover
                    onClick={() => {
                      onSelectTender(row);
                      onNavigate('/tenders/detail');
                    }}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell padding="checkbox" sx={{ py: '10px' }}>
                      <Checkbox
                        size="small"
                        icon={<ThinCheckboxIcon />}
                        checked={checkedRows.has(idx)}
                        onChange={(e) => { e.stopPropagation(); setCheckedRows((prev) => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; }); }}
                        sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {row.serial}
                    </TableCell>
                    <TableCell sx={{ py: '10px' }}>
                      <Chip
                        icon={
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: sc.dot,
                              flexShrink: 0,
                            }}
                          />
                        }
                        label={t(`tenders.${row.status.toLowerCase()}`)}
                        size="small"
                        sx={{
                          bgcolor: sc.bg,
                          color: 'text.primary',
                          fontSize: 14,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          height: 24,
                          borderRadius: '100px',
                          '& .MuiChip-icon': { ml: '8px', mr: '-2px' },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {row.method}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {row.type}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px' }}>
                      {row.description}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.reference}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.created || <Box component="span" sx={{ color: 'text.disabled' }}>N/A</Box>}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.status === 'Planning' || !row.advertised
                        ? <Box component="span" sx={{ color: 'text.disabled' }}>N/A</Box>
                        : row.advertised}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.deadline || <Box component="span" sx={{ color: 'text.disabled' }}>N/A</Box>}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.expires || <Box component="span" sx={{ color: 'text.disabled' }}>N/A</Box>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRows.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: 'text.secondary', fontFamily: 'Inter, sans-serif' }}>
              {t('tenders.noTendersFound')}
            </Typography>
          </Box>
        )}
      </Box>
    </NavLayout>
  );
}
