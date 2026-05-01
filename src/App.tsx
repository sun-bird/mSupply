import {
  DashboardSpeed01Icon,
  DeliveryTruck02Icon,
  FirstAidKitIcon,
  HelpCircleIcon,
  Invoice02Icon,
  Login01Icon,
  PackageOpenIcon,
  PackageProcessIcon,
  PieChartIcon,
  PrinterIcon,
  ProfileIcon,
  Settings04Icon,
  ThermometerColdIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from './components/nav-layout';
import type { NavItem } from './components/nav-layout';
import GoodsReceivedView from './views/GoodsReceivedView';
import LoginSampleView from './views/LoginSampleView';
import PreferencesView from './views/PreferencesView';
import type { ColorMode } from './views/PreferencesView';
import StockView from './views/StockView';
import TendersView from './views/TendersView';
import type { TenderRow } from './views/TendersView';
import { INITIAL_TENDERS } from './components/tender/tenderList';
import TenderItemsView from './views/TenderItemsView';
import TenderPlanView from './views/TenderPlanView';
import TenderSourceView from './views/TenderSourceView';
import TenderEvaluateView from './views/TenderEvaluateView';
import TenderAwardView from './views/TenderAwardView';
import TenderStateView from './views/TenderStateView';
import TenderSuccessView from './views/TenderSuccessView';
import TenderNewView from './views/TenderNewView';
import ThemeEditorView from './views/ThemeEditorView';
import type { SavedTheme } from './views/ThemeEditorView';

const DEFAULT_PRIMARY = '#E95C30';
const STORAGE_THEMES = 'msupply-themes';
const STORAGE_THEMES_VERSION = 'msupply-themes-version';
const THEMES_VERSION = '7';
const STORAGE_ACTIVE = 'msupply-active-theme-id';
const STORAGE_COLOR_MODE = 'msupply-color-mode';

// Convert imported images to data URLs for localStorage persistence.
// Normalizes the source image to a long-edge between LOGO_RASTER_MIN and
// LOGO_RASTER_MAX: tiny SVGs are scaled up so they render crisply in the
// 80–140px preview, and huge source images are scaled down so the resulting
// data URL fits within localStorage quotas (~5MB total across all themes).
const LOGO_RASTER_MIN = 256;
const LOGO_RASTER_MAX = 512;
function imgToDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const srcW = img.width || LOGO_RASTER_MIN;
      const srcH = img.height || LOGO_RASTER_MIN;
      const longest = Math.max(srcW, srcH);
      let scale = 1;
      if (longest < LOGO_RASTER_MIN) scale = LOGO_RASTER_MIN / longest;
      else if (longest > LOGO_RASTER_MAX) scale = LOGO_RASTER_MAX / longest;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(srcW * scale);
      canvas.height = Math.round(srcH * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    // Resolve with null (not '') on load failure so consumers treat a broken
    // seed the same as "no logo" and fall back to the default preview/icon,
    // instead of rendering a broken-image <img src=""> tile.
    img.onerror = () => {
      console.warn(`[theme] failed to load logo asset: ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

const DEFAULT_THEMES: SavedTheme[] = [
  { id: 'default-msupply', themeName: 'mSupply', primaryColor: '#E95C30', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-tonga', themeName: 'Tonga', primaryColor: '#C10000', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-wfp', themeName: 'WFP', primaryColor: '#5A92E5', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-salud', themeName: 'Salud', primaryColor: '#32B1A5', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-fiji', themeName: 'Fiji', primaryColor: '#005D62', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-nigeria', themeName: 'Nigeria', primaryColor: '#008751', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-blue-ld', themeName: 'HiViz Blue (light & dark)', primaryColor: '#3E7BFA', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-green-ld', themeName: 'HiViz Green (light & dark)', primaryColor: '#05A660', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-amber-ld', themeName: 'HiViz Amber (light & dark)', primaryColor: '#D97706', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-blue-lo', themeName: 'HiViz Blue (light only)', primaryColor: '#1E40AF', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-green-lo', themeName: 'HiViz Green (light only)', primaryColor: '#047857', secondaryColor: '#FF8800', logoDataUrl: null },
  { id: 'default-hiviz-purple-lo', themeName: 'HiViz Purple (light only)', primaryColor: '#7C3AED', secondaryColor: '#FF8800', logoDataUrl: null },
];

const THEME_LOGOS: Record<string, string> = {
  'default-msupply': new URL('./assets/msupply-logo.svg', import.meta.url).href,
  'default-tonga': new URL('./assets/themes/tonga.png', import.meta.url).href,
  'default-wfp': new URL('./assets/themes/wfp.png', import.meta.url).href,
  'default-salud': new URL('./assets/themes/salud.png', import.meta.url).href,
  'default-fiji': new URL('./assets/themes/fiji.png', import.meta.url).href,
  'default-nigeria': new URL('./assets/themes/nigeria.png', import.meta.url).href,
  'default-hiviz-blue-ld': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
  'default-hiviz-green-ld': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
  'default-hiviz-amber-ld': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
  'default-hiviz-blue-lo': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
  'default-hiviz-green-lo': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
  'default-hiviz-purple-lo': new URL('./assets/themes/hiviz-cone.png', import.meta.url).href,
};

async function seedDefaultThemes(existing: SavedTheme[] = []): Promise<SavedTheme[]> {
  const existingById = new Map(existing.map((t) => [t.id, t]));
  const seeded: SavedTheme[] = [];

  // For each default theme:
  //   - If the user has uploaded their own logo (logoIsDefault === false),
  //     preserve it untouched along with their customized colors/name.
  //   - Otherwise (no prior entry, or prior logo was a seeded default),
  //     re-rasterize the asset so quality improvements from imgToDataUrl
  //     propagate to existing installations.
  for (const theme of DEFAULT_THEMES) {
    const prior = existingById.get(theme.id);
    const isUserLogo = prior && prior.logoIsDefault === false && prior.logoDataUrl;
    if (isUserLogo) {
      seeded.push({ ...prior });
      continue;
    }
    const logoSrc = THEME_LOGOS[theme.id];
    const logoDataUrl = logoSrc ? await imgToDataUrl(logoSrc) : null;
    seeded.push({
      ...(prior ?? theme),
      logoDataUrl,
      logoIsDefault: true,
    });
  }

  // Preserve any custom (non-default) themes the user created.
  const defaultIds = new Set(DEFAULT_THEMES.map((t) => t.id));
  for (const t of existing) {
    if (!defaultIds.has(t.id)) seeded.push(t);
  }

  persistThemes(seeded);
  return seeded;
}

function loadSavedThemes(): SavedTheme[] {
  try {
    const raw = localStorage.getItem(STORAGE_THEMES);
    if (raw) return JSON.parse(raw) as SavedTheme[];
    // Return defaults without logos initially — useEffect will seed with logos
    return DEFAULT_THEMES;
  } catch {
    return DEFAULT_THEMES;
  }
}

/**
 * Thrown when browser localStorage is too full to persist the themes array.
 * Distinct class so callers can render a targeted error message.
 */
export class ThemeStorageQuotaError extends Error {
  readonly approximateBytes: number;
  constructor(approximateBytes: number) {
    super(`Browser storage is full — cannot save theme (~${Math.round(approximateBytes / 1024)} KB).`);
    this.name = 'ThemeStorageQuotaError';
    this.approximateBytes = approximateBytes;
  }
}

function persistThemes(themes: SavedTheme[]) {
  const serialized = JSON.stringify(themes);
  try {
    localStorage.setItem(STORAGE_THEMES, serialized);
  } catch (err) {
    // QuotaExceededError (standard) or NS_ERROR_DOM_QUOTA_REACHED (Firefox).
    // Re-throw as a typed error so the theme editor can surface a useful
    // message instead of silently dropping the save.
    if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      throw new ThemeStorageQuotaError(serialized.length);
    }
    throw err;
  }
}

function loadActiveThemeId(): string | null {
  return localStorage.getItem(STORAGE_ACTIVE);
}

function persistActiveThemeId(id: string | null) {
  if (id) localStorage.setItem(STORAGE_ACTIVE, id);
  else localStorage.removeItem(STORAGE_ACTIVE);
}

function loadColorMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_COLOR_MODE);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function persistColorMode(mode: ColorMode) {
  localStorage.setItem(STORAGE_COLOR_MODE, mode);
}

const RTL_LANGUAGES = ['ar'];

const ltrCache = createCache({ key: 'mui' });
const rtlCache = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

function buildTheme(primaryColor: string, mode: 'light' | 'dark' = 'light', direction: 'ltr' | 'rtl' = 'ltr') {
  const isDark = mode === 'dark';
  return createTheme({
    direction,
    palette: {
      mode,
      primary: { main: primaryColor },
      background: isDark
        ? { default: '#121212', paper: '#1E1E1E' }
        : { default: '#F5F5F5', paper: '#FFFFFF' },
      text: isDark
        ? { primary: '#FAFAFA', secondary: '#B0B0B0' }
        : { primary: '#1C1C28', secondary: '#555770' },
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

function buildNavItems(t: (key: string) => string): NavItem[] {
  return [
    { label: t('nav.dashboard'), icon: <HugeiconsIcon icon={DashboardSpeed01Icon} size={22} />, href: '/dashboard' },
    { label: t('nav.tenders'), icon: <HugeiconsIcon icon={Invoice02Icon} size={22} />, href: '/tenders' },
    {
      label: t('nav.replenishment'), icon: <HugeiconsIcon icon={PackageOpenIcon} size={22} />, href: '/replenishment',
      children: [
        { label: t('nav.purchaseOrders'), href: '/replenishment/purchase-orders' },
        { label: t('nav.goodsReceived'), href: '/replenishment/goods-received' },
        { label: t('nav.internalOrders'), href: '/replenishment/internal-orders' },
        { label: t('nav.inboundShipments'), href: '/replenishment/inbound-shipments' },
        { label: t('nav.supplierReturns'), href: '/replenishment/supplier-returns' },
        { label: t('nav.rnrForms'), href: '/replenishment/rnr-forms' },
        { label: t('nav.suppliers'), href: '/replenishment/suppliers' },
      ],
    },
    {
      label: t('nav.inventory'), icon: <HugeiconsIcon icon={PackageProcessIcon} size={22} />, href: '/inventory',
      children: [
        { label: t('nav.stock'), href: '/inventory/stock' },
        { label: t('nav.locations'), href: '/inventory/locations' },
        { label: t('nav.stocktake'), href: '/inventory/stocktake' },
      ],
    },
    {
      label: t('nav.distribution'), icon: <HugeiconsIcon icon={DeliveryTruck02Icon} size={22} />, href: '/distribution',
      children: [
        { label: t('nav.requisitions'), href: '/distribution/requisitions' },
        { label: t('nav.outboundShipments'), href: '/distribution/outbound-shipments' },
        { label: t('nav.customerReturns'), href: '/distribution/customer-returns' },
        { label: t('nav.customers'), href: '/distribution/customers' },
      ],
    },
    {
      label: t('nav.dispensary'), icon: <HugeiconsIcon icon={FirstAidKitIcon} size={22} />, href: '/dispensary',
      children: [
        { label: t('nav.patients'), href: '/dispensary/patients' },
        { label: t('nav.prescriptions'), href: '/dispensary/prescriptions' },
        { label: t('nav.encounters'), href: '/dispensary/encounters' },
        { label: t('nav.clinicians'), href: '/dispensary/clinicians' },
      ],
    },
    {
      label: t('nav.coldChain'), icon: <HugeiconsIcon icon={ThermometerColdIcon} size={22} />, href: '/cold-chain',
      children: [
        { label: t('nav.equipment'), href: '/cold-chain/equipment' },
        { label: t('nav.monitoring'), href: '/cold-chain/monitoring' },
        { label: t('nav.sensors'), href: '/cold-chain/sensors' },
      ],
    },
    {
      label: t('nav.programs'), icon: <HugeiconsIcon icon={ProfileIcon} size={22} />, href: '/programs',
      children: [
        { label: t('nav.immunizations'), href: '/programs/immunizations' },
      ],
    },
    { label: t('nav.reports'), icon: <HugeiconsIcon icon={PieChartIcon} size={22} />, href: '/reports' },
    {
      label: t('nav.settings'), icon: <HugeiconsIcon icon={Settings04Icon} size={22} />, href: '/settings',
      children: [
        { label: t('nav.preferences'), href: '/settings/preferences' },
        { label: t('nav.sync'), href: '/settings/sync' },
        { label: t('nav.themes'), href: '/settings/themes' },
      ],
    },
    { label: t('nav.loginSample'), icon: <HugeiconsIcon icon={Login01Icon} size={22} />, href: '/login-sample' },
  ];
}

// Nav items with onClick handlers wired to navigate
function useNavItems(t: (key: string) => string, onNavigate: (path: string) => void): NavItem[] {
  return useMemo(() => {
    const items = buildNavItems(t);
    return items.map((item) => ({
      ...item,
      onClick: () => onNavigate(item.href),
      children: item.children?.map((child) => ({
        ...child,
        onClick: () => onNavigate(child.href),
      })),
    }));
  }, [t, onNavigate]);
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [activePath, setActivePath] = useState('/dashboard');
  const [tenders, setTenders] = useState<TenderRow[]>(INITIAL_TENDERS);
  const [selectedTender, setSelectedTender] = useState<TenderRow | null>(null);

  // Apply an edit to a tender. Updates the row in the master list AND the
  // currently selected tender so every view (banner countdowns, list, etc.)
  // sees the change immediately.
  const handleTenderChange = (next: TenderRow) => {
    setTenders((prev) => prev.map((t) => (t.serial === next.serial ? next : t)));
    setSelectedTender((prev) => (prev && prev.serial === next.serial ? next : prev));
  };

  // Append a freshly-created tender to the top of the list.
  const handleCreateTender = (next: TenderRow) => {
    setTenders((prev) => [next, ...prev]);
  };
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(loadSavedThemes);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(loadActiveThemeId);
  const [colorMode, setColorMode] = useState<ColorMode>(loadColorMode);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const wiredNavItems = useNavItems(t, setActivePath);

  const resolvedMode: 'light' | 'dark' =
    colorMode === 'system' ? (prefersDark ? 'dark' : 'light') : colorMode;

  const direction: 'ltr' | 'rtl' = RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';
  const theme = useMemo(() => buildTheme(primaryColor, resolvedMode, direction), [primaryColor, resolvedMode, direction]);
  const emotionCache = direction === 'rtl' ? rtlCache : ltrCache;

  // Set document direction for RTL languages
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  const handleColorModeChange = useCallback((mode: ColorMode) => {
    setColorMode(mode);
    persistColorMode(mode);
  }, []);

  // Seed default themes with logos on first visit or when version changes.
  // Passes the current saved themes so user uploads/customizations survive
  // THEMES_VERSION bumps.
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_THEMES) || localStorage.getItem(STORAGE_THEMES_VERSION) !== THEMES_VERSION) {
      seedDefaultThemes(savedThemes).then((seeded) => {
        setSavedThemes(seeded);
        localStorage.setItem(STORAGE_THEMES_VERSION, THEMES_VERSION);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply active theme on mount
  useEffect(() => {
    if (activeThemeId) {
      const saved = savedThemes.find((s) => s.id === activeThemeId);
      if (saved) {
        setPrimaryColor(saved.primaryColor);
        if (saved.logoDataUrl) setLogoUrl(saved.logoDataUrl);
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

  // Persist first, then update state. This lets a QuotaExceededError propagate
  // out to the caller (ThemeEditorView) instead of being swallowed inside a
  // setState updater, and keeps persisted + in-memory state consistent.
  const handleSaveTheme = useCallback((t: SavedTheme) => {
    const idx = savedThemes.findIndex((s) => s.id === t.id);
    const next = idx >= 0 ? savedThemes.map((s) => (s.id === t.id ? t : s)) : [...savedThemes, t];
    persistThemes(next); // throws ThemeStorageQuotaError on localStorage quota
    setSavedThemes(next);
    setActiveThemeId(t.id);
    persistActiveThemeId(t.id);
  }, [savedThemes]);

  // Apply an existing saved theme (from anywhere — preferences, theme editor
   // dropdown, etc). Updates colour + logo + active id in one go so the UI
   // reflects the change immediately.
  const handleSelectTheme = useCallback((id: string) => {
    const found = savedThemes.find((s) => s.id === id);
    if (!found) return;
    setPrimaryColor(found.primaryColor);
    setLogoUrl(found.logoDataUrl);
    setActiveThemeId(found.id);
    persistActiveThemeId(found.id);
  }, [savedThemes]);

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

  // Route content
  let content: React.ReactNode;
  if (activePath === '/settings/preferences') {
    content = (
      <PreferencesView
        navItems={wiredNavItems}
        onNavigate={setActivePath}
        colorMode={colorMode}
        onColorModeChange={handleColorModeChange}
        logoUrl={logoUrl ?? undefined}
        savedThemes={savedThemes}
        activeThemeId={activeThemeId}
        onSelectTheme={handleSelectTheme}
      />
    );
  } else if (activePath === '/inventory/stock') {
    content = <StockView navItems={wiredNavItems} onNavigate={setActivePath} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/replenishment/goods-received') {
    content = <GoodsReceivedView navItems={wiredNavItems} onNavigate={setActivePath} />;
  } else if (activePath === '/tenders/plan' && selectedTender) {
    content = <TenderPlanView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} onTenderChange={handleTenderChange} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/items' && selectedTender) {
    content = <TenderItemsView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/source' && selectedTender) {
    content = <TenderSourceView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/evaluate' && selectedTender) {
    content = <TenderEvaluateView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/award' && selectedTender) {
    content = <TenderAwardView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/success' && selectedTender) {
    content = <TenderSuccessView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/detail' && selectedTender) {
    content = <TenderStateView navItems={wiredNavItems} onNavigate={setActivePath} tender={selectedTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders/new') {
    content = <TenderNewView navItems={wiredNavItems} onNavigate={setActivePath} onCreate={handleCreateTender} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/tenders') {
    content = <TendersView navItems={wiredNavItems} onNavigate={setActivePath} onSelectTender={setSelectedTender} tenders={tenders} logoUrl={logoUrl ?? undefined} />;
  } else if (activePath === '/settings/themes') {
    content = (
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
    );
  } else if (activePath === '/login-sample') {
    content = (
      <LoginSampleView
        navItems={wiredNavItems}
        onNavigate={setActivePath}
        primaryColor={primaryColor}
        logoUrl={logoUrl}
      />
    );
  } else {
    content = (
      <NavLayout
        navItems={wiredNavItems}
        activePath={activePath}
        logoUrl={logoUrl ?? undefined}
        headerProps={{
          title: t('nav.dashboard'),
          primaryAction: undefined,
          comboActions: [
            {
              icon: <HugeiconsIcon icon={PrinterIcon} size={20} />,
              label: t('common.print'),
              onClick: () => {},
            },
            {
              icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />,
              label: t('common.help'),
              onClick: () => {},
            },
          ],
        }}
        footerProps={{
          storeName: 'Central Tamaki Warehouse',
          userName: 'Mark Prins',
          syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
          isOnline: true,
        }}
      >
        <div />
      </NavLayout>
    );
  }

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {content}
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
