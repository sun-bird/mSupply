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
import StockAddItemsModal from '../components/StockAddItemsModal';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

const rows = [
  { code: '030051', name: 'BCG Vaccine', category: 'BCG, Vial', batch: 'BCG01', expiry: 'Dec 2027', packSize: 10, quantity: 50, status: 'Active' },
  { code: '030062', name: 'Acetylsalicylic Acid 300mg tabs', category: 'Tablet', batch: 'ABC1234', expiry: 'Jun 2026', packSize: 100, quantity: 200, status: 'Active' },
  { code: '030074', name: 'Amoxicillin 250mg caps', category: 'Capsule', batch: 'AMX9876', expiry: 'Mar 2027', packSize: 500, quantity: 15, status: 'Low Stock' },
  { code: '030085', name: 'Oral Rehydration Salts', category: 'Sachet', batch: 'ORS2024', expiry: 'Sep 2026', packSize: 50, quantity: 120, status: 'Active' },
  { code: '030096', name: 'Paracetamol 500mg tabs', category: 'Tablet', batch: 'PCM5432', expiry: 'Jan 2028', packSize: 1000, quantity: 8, status: 'Low Stock' },
];

const statusColor = (s: string) =>
  s === 'Active'
    ? { bgcolor: 'rgba(62,123,250,0.1)', color: '#3E7BFA' }
    : { bgcolor: 'rgba(233,92,48,0.1)', color: '#E95C30' };

interface StockViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
}

export default function StockView({ navItems, onNavigate }: StockViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <StockAddItemsModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <NavLayout
        navItems={navItems}
        activePath="/inventory/stock"
        headerProps={{
          title: 'Stock',
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
          storeName: 'Central Tamaki Warehouse',
          userName: 'Mark Prins',
          syncedAt: 'Synced 3 mins ago',
          isOnline: true,
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'Inter, sans-serif' }}>
            <TableHead>
              <TableRow>
                {['Code', 'Name', 'Category', 'Batch', 'Expiry', 'Pack Size', 'Quantity', 'Status'].map((h) => (
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
                  key={row.code}
                  hover
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(233,92,48,0.03)' } }}
                >
                  <TableCell sx={{ fontSize: 14, color: '#3E7BFA', fontFamily: 'Inter, sans-serif', py: 1.5, fontWeight: 500 }}>
                    {row.code}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#555770', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.category}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.batch}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#555770', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.expiry}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.packSize}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', py: 1.5 }}>
                    {row.quantity}
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
              No stock items found.
            </Typography>
          </Box>
        )}
      </NavLayout>
    </>
  );
}
