import {
  AddCircleIcon,
  ArrowDown01Icon,
  EyeIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
  PrinterIcon,
  Search01Icon,
  Settings04Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
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
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

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
}

const rows: TenderRow[] = [
  { serial: 'TN-0047', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Total Parental Nutrition (TPN)', reference: 'RFQ - 2025/009', created: '15/3/2025', advertised: '2/4/2025', deadline: '30/4/2025', expires: '15/3/2027' },
  { serial: 'TN-0046', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Drug Eluting Stents', reference: 'RFQ - 2025/012', created: '22/4/2025', advertised: '10/5/2025', deadline: '7/6/2025', expires: '22/4/2027' },
  { serial: 'TN-0045', status: 'Advertised', method: 'RFQ', type: 'Supplies', description: 'Various Dental Burs', reference: 'RFQ - 2025/008', created: '3/2/2025', advertised: '18/2/2025', deadline: '18/3/2025', expires: '3/2/2027' },
  { serial: 'TN-0044', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Surgical Instruments', reference: 'RFT - 2025/003', created: '10/1/2025', advertised: '25/1/2025', deadline: '22/2/2025', expires: '10/1/2027' },
  { serial: 'TN-0043', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Various HIV Medicines', reference: 'RFT - 2025/004', created: '28/1/2025', advertised: '14/2/2025', deadline: '14/3/2025', expires: '28/1/2027' },
  { serial: 'TN-0042', status: 'Award', method: 'RFQ', type: 'Supplies', description: 'Intravenous Infusion Pumps…', reference: 'RFQ - 2025/006', created: '5/12/2024', advertised: '20/12/2024', deadline: '20/1/2025', expires: '5/12/2026' },
];

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
  logoUrl?: string;
}

export default function TendersView({ navItems, onNavigate, onSelectTender, logoUrl }: TendersViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [activeFilter, setActiveFilter] = useState('active');
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

  const statusFilters = [
    { key: 'active', label: t('tenders.activeTenders'), count: rows.length },
    { key: 'Planning', label: t('tenders.planning'), count: rows.filter((r) => r.status === 'Planning').length },
    { key: 'Advertised', label: t('tenders.advertised'), count: rows.filter((r) => r.status === 'Advertised').length },
    { key: 'Evaluation', label: t('tenders.evaluation'), count: rows.filter((r) => r.status === 'Evaluation').length },
    { key: 'Award', label: t('tenders.award'), count: rows.filter((r) => r.status === 'Award').length },
    { key: 'Finalised', label: t('tenders.finalised'), count: rows.filter((r) => r.status === 'Finalised').length },
  ];

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) => {
      const matchesStatus = activeFilter === 'active' || row.status === activeFilter;
      if (!matchesStatus) return false;
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
  }, [activeFilter, searchQuery, sortKey, sortDir]);

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: t('tenders.title'),
        onBack: () => onNavigate('/dashboard'),
        primaryAction: {
          label: t('tenders.newTender'),
          icon: <HugeiconsIcon icon={AddCircleIcon} size={18} color={primaryColor} />,
          onClick: () => {},
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
        storeName: 'Central Tamaki Warehouse',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: 'text.secondary' }}>
            {t('tenders.showAll')}
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
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: '10px' }}>
                  <Checkbox size="small" icon={<ThinCheckboxIcon />} sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                </TableCell>
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: '10px' }} />
                {[
                  { key: 'serial', label: t('tenders.serial') },
                  { key: 'status', label: t('tenders.status') },
                  { key: 'method', label: t('tenders.method') },
                  { key: 'type', label: t('tenders.type') },
                  { key: 'description', label: t('tenders.description'), minWidth: 160 },
                  { key: 'reference', label: t('tenders.reference') },
                  { key: 'created', label: t('tenders.created') },
                  { key: 'advertised', label: t('tenders.advertised') },
                  { key: 'deadline', label: t('tenders.deadline') },
                  { key: 'expires', label: t('tenders.expires') },
                ].map((col) => (
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
              {filteredRows.map((row, idx) => {
                const sc = statusColors[row.status] ?? statusColors.Planning;
                return (
                  <TableRow
                    key={idx}
                    hover
                    onClick={() => {
                      onSelectTender(row);
                      onNavigate('/replenishment/tenders/detail');
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
                    <TableCell sx={{ py: '10px', width: 40 }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                      </IconButton>
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
                      {row.created}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.advertised}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.deadline}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: '10px', whiteSpace: 'nowrap' }}>
                      {row.expires}
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
