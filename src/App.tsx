import {
  DashboardSpeed01Icon,
  DeliveryTruck02Icon,
  FirstAidKitIcon,
  PackageOpenIcon,
  PackageProcessIcon,
  PieChartIcon,
  ProfileIcon,
  Settings04Icon,
  ThermometerColdIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { NavLayout } from './components/nav-layout';
import type { NavItem } from './components/nav-layout';

const theme = createTheme({
  palette: {
    primary: { main: '#E95C30' },
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
    text: { primary: '#1C1C28', secondary: '#555770' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `,
    },
  },
});

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <HugeiconsIcon icon={DashboardSpeed01Icon} size={22} />,
    href: '/dashboard',
  },
  {
    label: 'Replenishment',
    icon: <HugeiconsIcon icon={PackageOpenIcon} size={22} />,
    href: '/replenishment',
    children: [
      { label: 'Purchase Orders', href: '/replenishment/purchase-orders' },
      { label: 'Goods Received', href: '/replenishment/goods-received' },
      { label: 'Internal Orders', href: '/replenishment/internal-orders' },
      { label: 'Inbound Shipments', href: '/replenishment/inbound-shipments' },
      { label: 'Supplier Returns', href: '/replenishment/supplier-returns' },
      { label: 'R&R Forms', href: '/replenishment/rnr-forms' },
      { label: 'Suppliers', href: '/replenishment/suppliers' },
    ],
  },
  {
    label: 'Inventory',
    icon: <HugeiconsIcon icon={PackageProcessIcon} size={22} />,
    href: '/inventory',
    children: [
      { label: 'Stock', href: '/inventory/stock' },
      { label: 'Locations', href: '/inventory/locations' },
      { label: 'Stocktake', href: '/inventory/stocktake' },
    ],
  },
  {
    label: 'Distribution',
    icon: <HugeiconsIcon icon={DeliveryTruck02Icon} size={22} />,
    href: '/distribution',
    children: [
      { label: 'Requisitions', href: '/distribution/requisitions' },
      { label: 'Outbound Shipments', href: '/distribution/outbound-shipments' },
      { label: 'Customer Returns', href: '/distribution/customer-returns' },
      { label: 'Customers', href: '/distribution/customers' },
    ],
  },
  {
    label: 'Dispensary',
    icon: <HugeiconsIcon icon={FirstAidKitIcon} size={22} />,
    href: '/dispensary',
    children: [
      { label: 'Patients', href: '/dispensary/patients' },
      { label: 'Prescriptions', href: '/dispensary/prescriptions' },
      { label: 'Encounters', href: '/dispensary/encounters' },
      { label: 'Clinicians', href: '/dispensary/clinicians' },
    ],
  },
  {
    label: 'Cold Chain',
    icon: <HugeiconsIcon icon={ThermometerColdIcon} size={22} />,
    href: '/cold-chain',
    children: [
      { label: 'Equipment', href: '/cold-chain/equipment' },
      { label: 'Monitoring', href: '/cold-chain/monitoring' },
      { label: 'Sensors', href: '/cold-chain/sensors' },
    ],
  },
  {
    label: 'Programs',
    icon: <HugeiconsIcon icon={ProfileIcon} size={22} />,
    href: '/programs',
    children: [
      { label: 'Immunizations', href: '/programs/immunizations' },
    ],
  },
  {
    label: 'Reports',
    icon: <HugeiconsIcon icon={PieChartIcon} size={22} />,
    href: '/reports',
  },
  {
    label: 'Settings',
    icon: <HugeiconsIcon icon={Settings04Icon} size={22} />,
    href: '/settings',
    children: [
      { label: 'Preferences', href: '/settings/preferences' },
      { label: 'Sync', href: '/settings/sync' },
    ],
  },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavLayout
        navItems={navItems}
        activePath="/inventory/locations"
        headerProps={{
          title: 'View Title',
          onBack: () => console.log('back'),
          primaryAction: {
            label: 'Primary CTA',
            icon: <AddCircleOutlineIcon />,
            onClick: () => console.log('primary action'),
          },
          comboActions: [
            {
              icon: <PrintOutlinedIcon />,
              label: 'Print',
              onClick: () => console.log('print'),
            },
            {
              icon: <HelpOutlineIcon />,
              label: 'Help',
              onClick: () => console.log('help'),
            },
          ],
        }}
        footerProps={{
          storeName: 'Central Tamaki Warehouse',
          userName: 'Chloe Dimock',
          syncedAt: 'Synced 3 mins ago',
          isOnline: true,
        }}
      >
        {/* Main content area */}
      </NavLayout>
    </ThemeProvider>
  );
}
