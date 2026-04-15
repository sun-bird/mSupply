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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
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

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      item.itemCode.toLowerCase().includes(q) ||
      item.itemNumber.toLowerCase().includes(q)
    );
  });

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
        title: `${tender.serial} > ${tender.description} > ${t('tenderItems.title')}`,
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
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}>
                  <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                </TableCell>
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }} />
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'text.secondary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                      ...(col.minWidth && { minWidth: col.minWidth }),
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
                {/* Notes column */}
                <TableCell sx={{ width: 40, borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, idx) => (
                <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell padding="checkbox" sx={{ py: 1.5 }}>
                    <Checkbox size="small" sx={{ color: '#3E7BFA', '&.Mui-checked': { color: '#3E7BFA' }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5, width: 40 }}>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.itemNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.itemCode}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.itemName}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.numberOfPacks}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.packSize}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.totalQuantity}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.unitType}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.productSpecifications}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: 'text.primary', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {item.conditions}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, width: 40 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pb: 4 }}>
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
