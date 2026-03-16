import AcUnitIcon from '@mui/icons-material/AcUnit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
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
  { label: 'Dashboard', icon: <DashboardOutlinedIcon />, href: '/dashboard' },
  { label: 'Replenishment', icon: <Inventory2OutlinedIcon />, href: '/replenishment' },
  { label: 'Inventory', icon: <Inventory2OutlinedIcon />, href: '/inventory' },
  { label: 'Distribution', icon: <LocalShippingOutlinedIcon />, href: '/distribution' },
  { label: 'Dispensary', icon: <MedicationOutlinedIcon />, href: '/dispensary' },
  { label: 'Cold Chain', icon: <AcUnitIcon />, href: '/cold-chain' },
  { label: 'Programs', icon: <GroupsOutlinedIcon />, href: '/programs' },
  { label: 'Reports', icon: <AssessmentOutlinedIcon />, href: '/reports' },
  { label: 'Settings', icon: <SettingsOutlinedIcon />, href: '/settings' },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavLayout
        navItems={navItems}
        activePath="/dashboard"
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
