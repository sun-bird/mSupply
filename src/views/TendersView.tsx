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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

interface TenderRow {
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
  { serial: 'AB123', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Total Parental Nutrition (TPN)', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '23/09/2025', deadline: '10/8/2025', expires: '19/5/2027' },
  { serial: 'AB123', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Drug Eluting Stents', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '23/09/2025', deadline: '10/8/2025', expires: '19/5/2027' },
  { serial: 'AB123', status: 'Advertised', method: 'RFQ', type: 'Supplies', description: 'Various Dental Burs', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '29/7/2025', deadline: '10/8/2025', expires: '19/5/2027' },
  { serial: 'AB123', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Surgical Instruments', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '29/7/2025', deadline: '10/8/2025', expires: '19/5/2027' },
  { serial: 'AB123', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Various HIV Medicines', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '29/7/2025', deadline: '10/8/2025', expires: '19/5/2027' },
  { serial: 'AB123', status: 'Award', method: 'RFQ', type: 'Supplies', description: 'Intravenous Infusion Pumps…', reference: 'RFQ - 2025/009', created: '28/7/2025', advertised: '29/7/2025', deadline: '10/8/2025', expires: '19/5/2027' },
];

const statusColors: Record<string, { dot: string; bg: string }> = {
  Planning: { dot: '#8E8EA9', bg: '#F2F2F5' },
  Advertised: { dot: '#FDAC42', bg: 'rgba(253,172,66,0.2)' },
  Evaluation: { dot: '#3E7BFA', bg: '#E8F1FE' },
  Award: { dot: '#05A660', bg: 'rgba(5,166,96,0.2)' },
  Finalised: { dot: '#3E7BFA', bg: 'rgba(62,123,250,0.1)' },
};

interface TendersViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
}

export default function TendersView({ navItems, onNavigate }: TendersViewProps) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilters = [
    { key: 'active', label: t('tenders.activeTenders'), count: rows.length },
    { key: 'Planning', label: t('tenders.planning'), count: rows.filter((r) => r.status === 'Planning').length },
    { key: 'Advertised', label: t('tenders.advertised'), count: rows.filter((r) => r.status === 'Advertised').length },
    { key: 'Evaluation', label: t('tenders.evaluation'), count: rows.filter((r) => r.status === 'Evaluation').length },
    { key: 'Award', label: t('tenders.award'), count: rows.filter((r) => r.status === 'Award').length },
    { key: 'Finalised', label: t('tenders.finalised'), count: rows.filter((r) => r.status === 'Finalised').length },
  ];

  const filteredRows = rows.filter((row) => {
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

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      headerProps={{
        title: t('tenders.title'),
        onBack: () => onNavigate('/dashboard'),
        primaryAction: {
          label: t('tenders.newTender'),
          icon: <HugeiconsIcon icon={AddCircleIcon} size={18} color="#E95C30" />,
          onClick: () => {},
        },
        secondaryActions: [
          {
            label: t('tenders.tenderSettings'),
            icon: <HugeiconsIcon icon={Settings04Icon} size={18} />,
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
      <Box sx={{ display: 'flex', gap: '10px', mb: 3, overflowX: 'auto', pb: 1 }}>
        {statusFilters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Box
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              sx={{
                minWidth: 140,
                height: 120,
                borderRadius: '10px',
                flexShrink: 0,
                bgcolor: isActive ? '#E8F1FE' : '#FFFFFF',
                border: isActive ? '2px solid #3E7BFA' : '1px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                px: '20px',
                py: '20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Chip
                label={filter.label}
                size="small"
                sx={{
                  bgcolor: isActive ? '#3E7BFA' : '#F2F2F5',
                  color: isActive ? '#FFFFFF' : '#1C1C28',
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  height: 24,
                  borderRadius: '100px',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: '50px',
                  color: '#555770',
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
              bgcolor: '#F2F2F5',
              borderRadius: '8px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton size="small" sx={{ color: '#555770' }}>
              <HugeiconsIcon icon={EyeIcon} size={20} />
            </IconButton>
          </Box>
          <InputBase
            placeholder={t('tenders.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <HugeiconsIcon icon={Search01Icon} size={18} color="#555770" />
              </InputAdornment>
            }
            sx={{
              bgcolor: '#F2F2F5',
              borderRadius: '8px',
              height: 36,
              width: 200,
              px: 1.5,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#555770' }}>
            {t('tenders.showAll')}
          </Typography>
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} color="#555770" />
        </Box>
      </Box>

      {/* Data Table */}
      <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '10px' }}>
        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}>
                  <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' } }} />
                </TableCell>
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }} />
                {[
                  t('tenders.serial'),
                  t('tenders.status'),
                  t('tenders.method'),
                  t('tenders.type'),
                  t('tenders.description'),
                  t('tenders.reference'),
                  t('tenders.created'),
                  t('tenders.advertised'),
                  t('tenders.deadline'),
                  t('tenders.expires'),
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#555770',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
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
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(233,92,48,0.03)' } }}
                  >
                    <TableCell padding="checkbox" sx={{ py: 1.5 }}>
                      <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' } }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, width: 40 }}>
                      <IconButton size="small" sx={{ color: '#555770' }}>
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                      {row.serial}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
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
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: sc.bg,
                          color: '#1C1C28',
                          fontSize: 14,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          height: 24,
                          borderRadius: '100px',
                          '& .MuiChip-icon': { ml: '8px', mr: '-2px' },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                      {row.method}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                      {row.type}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                      {row.description}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5, whiteSpace: 'nowrap' }}>
                      {row.reference}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5, whiteSpace: 'nowrap' }}>
                      {row.created}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5, whiteSpace: 'nowrap' }}>
                      {row.advertised}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5, whiteSpace: 'nowrap' }}>
                      {row.deadline}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5, whiteSpace: 'nowrap' }}>
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
            <Typography sx={{ color: '#555770', fontFamily: 'Inter, sans-serif' }}>
              {t('tenders.noTendersFound')}
            </Typography>
          </Box>
        )}
      </Box>
    </NavLayout>
  );
}
