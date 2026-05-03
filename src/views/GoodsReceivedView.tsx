import { AddCircleIcon, HelpCircleIcon, PrinterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AddItemsModal from '../components/AddItemsModal';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

const rows = [
  { id: 'GR-0042', supplier: 'Essential Medicines Co.', date: '12 Mar 2026', items: 4, status: 'Finalised' },
  { id: 'GR-0041', supplier: 'MedSupply NZ', date: '10 Mar 2026', items: 7, status: 'Finalised' },
  { id: 'GR-0040', supplier: 'Pacific Pharma', date: '6 Mar 2026', items: 2, status: 'Finalised' },
  { id: 'GR-0039', supplier: 'Essential Medicines Co.', date: '28 Feb 2026', items: 5, status: 'Finalised' },
  { id: 'GR-0038', supplier: 'Global Health Supplies', date: '21 Feb 2026', items: 9, status: 'Finalised' },
];

const statusColor = (s: string) =>
  s === 'Finalised'
    ? { bgcolor: 'rgba(62,123,250,0.1)', color: '#3E7BFA' }
    : { bgcolor: 'rgba(233,92,48,0.1)', color: '#E95C30' };

interface GoodsReceivedViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
}

export default function GoodsReceivedView({ navItems, onNavigate }: GoodsReceivedViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AddItemsModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <NavLayout
        navItems={navItems}
        activePath="/replenishment/goods-received"
        headerProps={{
          title: 'Goods Received',
          onBack: () => onNavigate('/dashboard'),
          primaryAction: {
            label: 'Add Items',
            icon: <HugeiconsIcon icon={AddCircleIcon} size={18} color="#E95C30" />,
            onClick: () => setModalOpen(true),
          },
          comboActions: [
            {
              icon: <HugeiconsIcon icon={PrinterIcon} size={20} />,
              label: 'Print',
              onClick: () => {},
            },
            {
              icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />,
              label: 'Help',
              onClick: () => {},
            },
          ],
        }}
        footerProps={{
          storeName: 'Central HQ',
          userName: 'Mark Prins',
          syncedAt: 'Synced 3 mins ago',
          isOnline: true,
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                {['Reference', 'Supplier', 'Date', 'Items', 'Status'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#555770',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(233,92,48,0.03)' } }}
                >
                  <TableCell sx={{ fontSize: 14, color: '#3E7BFA', fontFamily: 'Inter, sans-serif', py: 1.5, fontWeight: 500 }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.supplier}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#555770', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.date}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.items}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        ...statusColor(row.status),
                        fontSize: 12,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        height: 24,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {rows.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography sx={{ color: '#555770', fontFamily: 'Inter, sans-serif' }}>
              No goods received records found.
            </Typography>
          </Box>
        )}
      </NavLayout>
    </>
  );
}
