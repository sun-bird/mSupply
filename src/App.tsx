import {
  DashboardSpeed01Icon,
  DeliveryTruck02Icon,
  FirstAidKitIcon,
  HelpCircleIcon,
  PackageOpenIcon,
  PackageProcessIcon,
  PieChartIcon,
  PrinterIcon,
  ProfileIcon,
  Settings04Icon,
  ThermometerColdIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLayout } from './components/nav-layout';
import type { NavItem } from './components/nav-layout';
import GoodsReceivedView from './views/GoodsReceivedView';
import StockView from './views/StockView';
import LoginSampleView from './views/LoginSampleView';
import ThemeEditorView from './views/ThemeEditorView';
import type { SavedTheme } from './views/ThemeEditorView';

const DEFAULT_PRIMARY = '#E95C30';
const STORAGE_THEMES = 'msupply-themes';
const STORAGE_ACTIVE = 'msupply-active-theme-id';

function loadSavedThemes(): SavedTheme[] {
  try {
    const raw = localStorage.getItem(STORAGE_THEMES);
    return raw ? (JSON.parse(raw) as SavedTheme[]) : [];
  } catch {
    return [];
  }
}

function persistThemes(themes: SavedTheme[]) {
  localStorage.setItem(STORAGE_THEMES, JSON.stringify(themes));
}

function loadActiveThemeId(): string | null {
  return localStorage.getItem(STORAGE_ACTIVE);
}

function persistActiveThemeId(id: string | null) {
  if (id) localStorage.setItem(STORAGE_ACTIVE, id);
  else localStorage.removeItem(STORAGE_ACTIVE);
}

function buildTheme(primaryColor: string) {
  return createTheme({
    palette: {
      primary: { main: primaryColor },
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
}

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
      { label: 'Themes', href: '/settings/themes' },
      { label: 'Login Sample', href: '/settings/login-sample' },
    ],
  },
];

// Nav items with onClick handlers wired to navigate
function useNavItems(onNavigate: (path: string) => void): NavItem[] {
  return navItems.map((item) => ({
    ...item,
    onClick: () => onNavigate(item.href),
    children: item.children?.map((child) => ({
      ...child,
      onClick: () => onNavigate(child.href),
    })),
  }));
}

export default function App() {
  const [activePath, setActivePath] = useState('/dashboard');
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(loadSavedThemes);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(loadActiveThemeId);
  const wiredNavItems = useNavItems(setActivePath);

  const theme = useMemo(() => buildTheme(primaryColor), [primaryColor]);

  // Apply active theme on mount
  useEffect(() => {
    if (activeThemeId) {
      const t = savedThemes.find((s) => s.id === activeThemeId);
      if (t) {
        setPrimaryColor(t.primaryColor);
        if (t.logoDataUrl) setLogoUrl(t.logoDataUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrimaryColorChange = useCallback((color: string) => {
    setPrimaryColor(color);
  }, []);

  const handleLogoChange = useCallback((url: string | null) => {
    setLogoUrl(url);
  }, []);

  const handleSaveTheme = useCallback((t: SavedTheme) => {
    setSavedThemes((prev) => {
      const idx = prev.findIndex((s) => s.id === t.id);
      const next = idx >= 0 ? prev.map((s) => (s.id === t.id ? t : s)) : [...prev, t];
      persistThemes(next);
      return next;
    });
    setActiveThemeId(t.id);
    persistActiveThemeId(t.id);
  }, []);

  const handleDeleteTheme = useCallback((id: string) => {
    setSavedThemes((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistThemes(next);
      return next;
    });
    if (activeThemeId === id) {
      setActiveThemeId(null);
      persistActiveThemeId(null);
    }
  }, [activeThemeId]);

  if (activePath === '/inventory/stock') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StockView navItems={wiredNavItems} onNavigate={setActivePath} />
      </ThemeProvider>
    );
  }

  if (activePath === '/replenishment/goods-received') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoodsReceivedView navItems={wiredNavItems} onNavigate={setActivePath} />
      </ThemeProvider>
    );
  }

  if (activePath === '/settings/themes') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeEditorView
          navItems={wiredNavItems}
          onNavigate={setActivePath}
          onPrimaryColorChange={handlePrimaryColorChange}
          onLogoChange={handleLogoChange}
          initialPrimaryColor={primaryColor}
          savedThemes={savedThemes}
          activeThemeId={activeThemeId}
          onSaveTheme={handleSaveTheme}
          onDeleteTheme={handleDeleteTheme}
        />
      </ThemeProvider>
    );
  }

  if (activePath === '/settings/login-sample') {
    const activeTheme = savedThemes.find((s) => s.id === activeThemeId);
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginSampleView
          navItems={wiredNavItems}
          onNavigate={setActivePath}
          primaryColor={primaryColor}
          secondaryColor={activeTheme?.secondaryColor ?? '#FF8800'}
          logoUrl={logoUrl}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavLayout
        navItems={wiredNavItems}
        activePath={activePath}
        logoUrl={logoUrl ?? undefined}
        headerProps={{
          title: 'Dashboard',
          primaryAction: undefined,
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
        <div />
      </NavLayout>
    </ThemeProvider>
  );
}
