import {
  AddCircleIcon,
  Cancel01Icon,
  Delete02Icon,
  FloppyDiskIcon,
  HelpCircleIcon,
  PaintBoardIcon,
  PencilEdit01Icon,
  PrinterIcon,
  SourceCodeSquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Popover,
  Snackbar,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import msupplyLogo from '../assets/msupply-logo.svg';
import ThemeDrawer from '../components/ThemeDrawer';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SavedTheme {
  id: string;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  logoDataUrl: string | null;
  /**
   * True when logoDataUrl was produced by seedDefaultThemes() (i.e. rasterized
   * from an asset). False when the user explicitly uploaded a logo. Used by
   * seedDefaultThemes() to decide whether a logo can be refreshed on a
   * THEMES_VERSION bump — user uploads are always preserved.
   */
  logoIsDefault?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Color swatch + hex input                                          */
/* ------------------------------------------------------------------ */

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  required?: boolean;
}

function ColorField({ label, value, onChange, required }: ColorFieldProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleHexInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
      onChange(raw.startsWith('#') ? raw : `#${raw}`);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: '12px', sm: '20px' },
        height: 60,
        py: '10px',
        width: '100%',
        maxWidth: 560,
      }}
    >
      <Typography
        sx={{
          width: 180,
          flexShrink: 0,
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '16px',
          color: 'text.primary',
          textAlign: 'left',
        }}
      >
        {label} {required && <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: { xs: 180, sm: 260 },
          flexShrink: 0,
          height: 40,
          bgcolor: 'background.paper',
          borderRadius: '10px',
          boxShadow:
            '0px 0px 2px 0px rgba(40,41,61,0.04), 0px 4px 8px 0px rgba(96,97,112,0.16)',
          px: '10px',
        }}
      >
        <TextField
          value={value}
          onChange={handleHexInput}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          inputProps={{ maxLength: 7 }}
          sx={{
            flex: 1,
            '& .MuiInputBase-input': {
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '16px',
              color: 'text.secondary',
              p: 0,
            },
          }}
        />
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: value,
            cursor: 'pointer',
            border: '2px solid rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
        />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, borderRadius: '12px', mt: 1 } } }}
      >
        <HexColorPicker color={value} onChange={onChange} />
      </Popover>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo drop zone                                                    */
/* ------------------------------------------------------------------ */

const MAX_LOGO_SIZE = 1024 * 1024; // 1 MB

interface LogoDropZoneProps {
  previewUrl: string | null;
  defaultUrl?: string;
  onFileChange: (file: File | null) => void;
}

function LogoDropZone({ previewUrl, defaultUrl, onFileChange }: LogoDropZoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayUrl = previewUrl || defaultUrl || null;

  const handleFile = (file: File) => {
    if (file.size > MAX_LOGO_SIZE) {
      setError(t('themeEditor.fileTooLarge'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError(t('themeEditor.fileMustBeImage'));
      return;
    }
    setError(null);
    onFileChange(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{ position: 'relative' }}
      >
        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          sx={{
            width: 140,
            height: 140,
            borderRadius: '12px',
            border: dragOver
              ? '2px solid #3E7BFA'
              : '2px dashed rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            bgcolor: dragOver ? 'rgba(62,123,250,0.04)' : 'transparent',
            transition: 'all 0.15s',
            '&:hover': { borderColor: '#3E7BFA', bgcolor: 'rgba(62,123,250,0.04)' },
          }}
        >
          {displayUrl ? (
            <Box
              component="img"
              src={displayUrl}
              alt="Logo preview"
              sx={{ width: 80, height: 80, objectFit: 'contain' }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: '16px' }}>
                {t('themeEditor.dragDropLogo')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Edit button — bottom right, only when logo exists */}
        {displayUrl && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            size="small"
            sx={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              bgcolor: 'background.paper',
              boxShadow: '0px 1px 4px rgba(0,0,0,0.15)',
              width: 28,
              height: 28,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          </IconButton>
        )}
      </Box>

      {error && (
        <Typography sx={{ fontSize: 11, color: 'error.main' }}>{error}</Typography>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Build a displayable theme JSON from current state                 */
/* ------------------------------------------------------------------ */

function buildThemeJson(themeName: string, primaryColor: string, secondaryColor: string) {
  return JSON.stringify(
    {
      themeName,
      palette: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
      breakpoints: {
        values: { xs: 0, sm: 601, md: 1025, lg: 1441, xl: 1537 },
      },
      direction: 'ltr',
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
    null,
    4,
  );
}

/* ------------------------------------------------------------------ */
/*  Convert File to data URL for localStorage persistence             */
/* ------------------------------------------------------------------ */

// Keep in sync with LOGO_RASTER_MAX in App.tsx. Large uploads are downscaled
// so the resulting data URL fits localStorage quotas (~5MB total across all
// themes). 512px long-edge is plenty for the 80–140px preview.
const LOGO_UPLOAD_MAX = 512;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      // Rasterize through a canvas so we can downscale oversized uploads.
      const img = new Image();
      img.onload = () => {
        const longest = Math.max(img.width, img.height);
        const scale = longest > LOGO_UPLOAD_MAX ? LOGO_UPLOAD_MAX / longest : 1;
        if (scale === 1) {
          resolve(raw);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = raw;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Shared button shadow                                              */
/* ------------------------------------------------------------------ */

const BTN_SHADOW =
  '0px 0px 2px 0px rgba(40,41,61,0.04), 0px 4px 8px 0px rgba(96,97,112,0.16)';

/* ------------------------------------------------------------------ */
/*  ThemeEditorView                                                   */
/* ------------------------------------------------------------------ */

interface ThemeEditorViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  onPrimaryColorChange: (color: string) => void;
  onLogoChange: (url: string | null) => void;
  initialPrimaryColor: string;
  savedThemes: SavedTheme[];
  activeThemeId: string | null;
  onSaveTheme: (theme: SavedTheme) => void;
  onDeleteTheme: (id: string) => void;
}

const DEFAULT_STATE = {
  themeName: 'mSupply',
  primaryColor: '#E95C30',
  secondaryColor: '#FF8800',
};

export default function ThemeEditorView({
  navItems,
  onNavigate,
  onPrimaryColorChange,
  onLogoChange,
  initialPrimaryColor,
  savedThemes,
  activeThemeId,
  onSaveTheme,
  onDeleteTheme,
}: ThemeEditorViewProps) {
  const { t } = useTranslation();

  /* ---- form state ---- */
  const [editingId, setEditingId] = useState<string | null>(activeThemeId);
  const [themeName, setThemeName] = useState(DEFAULT_STATE.themeName);
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_STATE.secondaryColor);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  /* ---- drawer state ---- */
  const [drawer1Open, setDrawer1Open] = useState(true);
  const [drawer2Open, setDrawer2Open] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saveToastOpen, setSaveToastOpen] = useState(false);
  // Error surface for save failures (decode error, storage quota, etc).
  // Kept separate from the success toast so both can't display at once.
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ---- editor state ---- */
  const [editorText, setEditorText] = useState('');
  const [jsonError, setJsonError] = useState(false);

  /* ---- snapshot of last-saved state for cancel ---- */
  const [snapshot, setSnapshot] = useState({
    themeName: DEFAULT_STATE.themeName,
    primaryColor: initialPrimaryColor,
    secondaryColor: DEFAULT_STATE.secondaryColor,
    logoPreviewUrl: null as string | null,
  });

  /* ---- Initialise from active saved theme on mount ---- */
  useEffect(() => {
    if (activeThemeId) {
      const t = savedThemes.find((s) => s.id === activeThemeId);
      if (t) {
        setEditingId(t.id);
        setThemeName(t.themeName);
        setPrimaryColor(t.primaryColor);
        setSecondaryColor(t.secondaryColor);
        setLogoPreviewUrl(t.logoDataUrl);
        setSnapshot({
          themeName: t.themeName,
          primaryColor: t.primaryColor,
          secondaryColor: t.secondaryColor,
          logoPreviewUrl: t.logoDataUrl,
        });
        if (t.logoDataUrl) onLogoChange(t.logoDataUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Sync form → JSON editor ---- */
  const generatedJson = useMemo(
    () => buildThemeJson(themeName, primaryColor, secondaryColor),
    [themeName, primaryColor, secondaryColor],
  );

  useEffect(() => {
    if (!jsonError) setEditorText(generatedJson);
  }, [generatedJson, jsonError]);

  /* ---- Propagate primary color up to App ---- */
  useEffect(() => {
    if (primaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      onPrimaryColorChange(primaryColor);
    }
  }, [primaryColor, onPrimaryColorChange]);

  /* ---- Handle logo file ---- */
  const handleLogoFile = useCallback(
    (file: File | null) => {
      setLogoFile(file);
      if (file) {
        const url = URL.createObjectURL(file);
        setLogoPreviewUrl(url);
        onLogoChange(url);
      } else {
        setLogoPreviewUrl(null);
        onLogoChange(null);
      }
    },
    [onLogoChange],
  );

  /* ---- Handle editor text changes ---- */
  const handleEditorChange = (text: string) => {
    setEditorText(text);
    try {
      const parsed = JSON.parse(text);
      setJsonError(false);
      if (typeof parsed.themeName === 'string') setThemeName(parsed.themeName.slice(0, 40));
      if (typeof parsed.palette?.primary === 'string' && parsed.palette.primary.match(/^#[0-9A-Fa-f]{6}$/)) {
        setPrimaryColor(parsed.palette.primary);
      }
      if (typeof parsed.palette?.secondary === 'string' && parsed.palette.secondary.match(/^#[0-9A-Fa-f]{6}$/)) {
        setSecondaryColor(parsed.palette.secondary);
      }
    } catch {
      setJsonError(true);
    }
  };

  /* ---- Load a saved theme into form ---- */
  const loadTheme = (id: string | '__new__') => {
    if (id === '__new__') {
      setEditingId(null);
      setThemeName(DEFAULT_STATE.themeName);
      setPrimaryColor(DEFAULT_STATE.primaryColor);
      setSecondaryColor(DEFAULT_STATE.secondaryColor);
      setLogoFile(null);
      setLogoPreviewUrl(null);
      onLogoChange(null);
      setSnapshot({
        themeName: DEFAULT_STATE.themeName,
        primaryColor: DEFAULT_STATE.primaryColor,
        secondaryColor: DEFAULT_STATE.secondaryColor,
        logoPreviewUrl: null,
      });
      return;
    }
    const found = savedThemes.find((s) => s.id === id);
    if (!found) return;
    setEditingId(found.id);
    setThemeName(found.themeName);
    setPrimaryColor(found.primaryColor);
    setSecondaryColor(found.secondaryColor);
    setLogoFile(null);
    setLogoPreviewUrl(found.logoDataUrl);
    if (found.logoDataUrl) onLogoChange(found.logoDataUrl);
    else onLogoChange(null);
    setSnapshot({
      themeName: found.themeName,
      primaryColor: found.primaryColor,
      secondaryColor: found.secondaryColor,
      logoPreviewUrl: found.logoDataUrl,
    });
  };

  /* ---- Cancel — revert to snapshot ---- */
  const handleCancel = () => {
    setThemeName(snapshot.themeName);
    setPrimaryColor(snapshot.primaryColor);
    setSecondaryColor(snapshot.secondaryColor);
    setLogoPreviewUrl(snapshot.logoPreviewUrl);
    setLogoFile(null);
    if (snapshot.logoPreviewUrl) onLogoChange(snapshot.logoPreviewUrl);
    else onLogoChange(null);
    setJsonError(false);
  };

  /* ---- Check for duplicate theme name ---- */
  const isDuplicateName = useMemo(() => {
    const trimmed = themeName.trim().toLowerCase();
    return savedThemes.some(
      (t) => t.themeName.toLowerCase() === trimmed && t.id !== editingId,
    );
  }, [themeName, savedThemes, editingId]);

  /* ---- Save ---- */
  const handleSave = async () => {
    if (!themeName.trim() || isDuplicateName) return;

    // Step 1: decode the uploaded image (may reject if the file is corrupt,
    // truncated, or not actually an image despite its MIME type).
    let logoDataUrl: string | null = logoPreviewUrl;
    if (logoFile) {
      try {
        logoDataUrl = await fileToDataUrl(logoFile);
      } catch (err) {
        console.error('[theme] failed to decode uploaded logo', err);
        setSaveError(t('themeEditor.logoDecodeFailed'));
        return;
      }
    }

    const theme: SavedTheme = {
      id: editingId ?? crypto.randomUUID(),
      themeName: themeName.trim(),
      primaryColor,
      secondaryColor,
      logoDataUrl,
      // If a new file was uploaded in this save, mark the logo as user-provided
      // so it survives future default re-seeds. Otherwise preserve the prior
      // flag (defaults remain flagged as default until the user replaces them).
      logoIsDefault: logoFile ? false : savedThemes.find((s) => s.id === editingId)?.logoIsDefault,
    };

    // Step 2: persist. handleSaveTheme throws ThemeStorageQuotaError when
    // localStorage is full, which we surface so the user knows the save
    // didn't land (otherwise they'd close the tab and lose everything).
    try {
      onSaveTheme(theme);
    } catch (err) {
      console.error('[theme] failed to persist theme', err);
      // err.name matches the class name defined in App.tsx (ThemeStorageQuotaError)
      const isQuota = err instanceof Error && err.name === 'ThemeStorageQuotaError';
      setSaveError(isQuota ? t('themeEditor.storageFull') : t('themeEditor.saveFailed'));
      return;
    }

    setEditingId(theme.id);
    setLogoFile(null);
    setLogoPreviewUrl(logoDataUrl);
    setSnapshot({
      themeName: theme.themeName,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      logoPreviewUrl: logoDataUrl,
    });
    setSaveToastOpen(true);
  };

  /* ---- Delete ---- */
  const handleDelete = () => {
    if (!editingId) return;
    onDeleteTheme(editingId);
    // Reset to new theme
    loadTheme('__new__');
  };

  const isExistingTheme = editingId !== null;

  return (
    <NavLayout
      navItems={navItems}
      activePath="/settings/themes"
      logoUrl={logoPreviewUrl || msupplyLogo}
      headerProps={{
        title: t('themeEditor.title'),
        onBack: () => onNavigate('/dashboard'),
        primaryAction: {
          label: t('themeEditor.createTheme'),
          icon: <HugeiconsIcon icon={AddCircleIcon} size={24} color={primaryColor} />,
          onClick: () => loadTheme('__new__'),
        },
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
        storeName: 'Central HQ',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          pt: '20px',
          px: { xs: 1, sm: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Drawer 1: Theme Information */}
        <ThemeDrawer
          title={t('themeEditor.themeInformation')}
          icon={<HugeiconsIcon icon={PaintBoardIcon} size={20} />}
          open={drawer1Open}
          onToggle={() => setDrawer1Open((v) => !v)}
        >
          <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', pl: '20px' }}>
            {/* Form fields (dropdown + inputs) */}
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              {/* Theme selector dropdown */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '12px', sm: '20px' },
                  height: 60,
                  py: '10px',
                  width: '100%',
                  maxWidth: 560,
                }}
              >
                <Typography
                  sx={{ width: 180, flexShrink: 0, fontWeight: 500, fontSize: 14, lineHeight: '16px', color: 'text.primary', textAlign: 'left' }}
                >
                  {t('themeEditor.theme')}
                </Typography>
                <Select
                  value={editingId || ''}
                  onChange={(e) => loadTheme(e.target.value as string)}
                  displayEmpty
                  size="small"
                  renderValue={(val) => {
                    const found = savedThemes.find((t) => t.id === val);
                    return found?.themeName || '';
                  }}
                  sx={{
                    width: { xs: 180, sm: 260 },
                    flexShrink: 0,
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    boxShadow: BTN_SHADOW,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { textAlign: 'left' },
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {savedThemes.map((theme) => (
                    <MenuItem key={theme.id} value={theme.id} sx={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {theme.logoDataUrl ? (
                        <Box component="img" src={theme.logoDataUrl} alt="" sx={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
                      ) : (
                        <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: theme.primaryColor, flexShrink: 0 }} />
                      )}
                      {theme.themeName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Theme Name */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '12px', sm: '20px' },
                  height: 60,
                  py: '10px',
                  width: '100%',
                  maxWidth: 560,
                }}
              >
                <Typography
                  sx={{ width: 180, flexShrink: 0, fontWeight: 500, fontSize: 14, lineHeight: '16px', color: 'text.primary', textAlign: 'left' }}
                >
                  {t('themeEditor.themeName')} <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: 180, sm: 260 },
                    flexShrink: 0,
                    height: 40,
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    boxShadow: BTN_SHADOW,
                    px: '10px',
                  }}
                >
                  <TextField
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value.slice(0, 40))}
                    variant="standard"
                    placeholder={t('themeEditor.enterThemeName')}
                    InputProps={{ disableUnderline: true }}
                    inputProps={{ maxLength: 40 }}
                    error={!themeName.trim() || isDuplicateName}
                    helperText={isDuplicateName ? t('themeEditor.nameExists') : undefined}
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-input': {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '16px',
                        color: 'text.secondary',
                        p: 0,
                      },
                    }}
                  />
                </Box>
              </Box>

              <ColorField label={t('themeEditor.brandColour')} value={primaryColor} onChange={setPrimaryColor} required />
              {/* <ColorField label="Secondary Brand Colour" value={secondaryColor} onChange={setSecondaryColor} /> */}
            </Box>

            {/* Logo drop zone — centered vertically beside all form fields */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pr: '40px' }}>
              <LogoDropZone previewUrl={logoPreviewUrl} defaultUrl={msupplyLogo} onFileChange={handleLogoFile} />
            </Box>
          </Box>

        </ThemeDrawer>

        {/* Drawer 2: Editor */}
        <ThemeDrawer
          title={t('themeEditor.editor')}
          icon={<HugeiconsIcon icon={SourceCodeSquareIcon} size={20} />}
          open={drawer2Open}
          onToggle={() => setDrawer2Open((v) => !v)}
        >
          <Box
            component="textarea"
            value={editorText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleEditorChange(e.target.value)}
            spellCheck={false}
            sx={{
              width: '100%',
              minHeight: 200,
              fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, monospace',
              fontSize: 14,
              lineHeight: '16px',
              color: jsonError ? 'error.main' : 'text.primary',
              border: jsonError ? '1px solid #d32f2f' : 'none',
              outline: 'none',
              resize: 'vertical',
              p: 0,
              bgcolor: 'transparent',
              whiteSpace: 'pre',
              overflowX: 'auto',
              colorScheme: (t) => t.palette.mode === 'dark' ? 'dark' : 'light',
              '&::-webkit-scrollbar': { width: 8, height: 8 },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 4 },
              '&::-webkit-scrollbar-thumb:hover': { bgcolor: 'text.secondary' },
            }}
          />
        </ThemeDrawer>

        {/* Action buttons — Cancel / Save / Delete */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexWrap: 'wrap',
            pt: '20px',
            pb: 4,
          }}
        >
          {/* Delete — only for existing saved themes */}
          {isExistingTheme && (
            <Button
              onClick={() => setDeleteConfirmOpen(true)}
              startIcon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
              sx={{
                mr: 'auto',
                height: 36,
                borderRadius: '24px',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 14,
                color: '#d32f2f',
                bgcolor: 'background.paper',
                boxShadow: BTN_SHADOW,
                px: '20px',
                '&:hover': { bgcolor: '#fef2f2' },
              }}
            >
              {t('common.delete')}
            </Button>
          )}

          {/* Cancel */}
          <Button
            onClick={handleCancel}
            startIcon={<HugeiconsIcon icon={Cancel01Icon} size={20} />}
            sx={{
              height: 36,
              borderRadius: '24px',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: '#3E7BFA',
              bgcolor: 'background.paper',
              boxShadow: BTN_SHADOW,
              px: '20px',
              '&:hover': { bgcolor: '#f0f4ff' },
            }}
          >
            {t('common.cancel')}
          </Button>

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={!themeName.trim() || isDuplicateName}
            startIcon={<HugeiconsIcon icon={FloppyDiskIcon} size={20} />}
            sx={{
              height: 36,
              borderRadius: '24px',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: 'white',
              bgcolor: '#3E7BFA',
              boxShadow: BTN_SHADOW,
              px: '20px',
              '&:hover': { bgcolor: '#2d6ae0' },
              '&.Mui-disabled': { bgcolor: '#a0b8f0', color: 'white' },
            }}
          >
            {t('common.save')}
          </Button>
        </Box>
      </Box>
      {/* Save toast */}
      <Snackbar
        open={saveToastOpen}
        autoHideDuration={3000}
        onClose={() => setSaveToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSaveToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('themeEditor.themeSaved')}
        </Alert>
      </Snackbar>

      {/* Save error toast — stays open until dismissed so a failed save
          can't be missed by a user who looked away. */}
      <Snackbar
        open={saveError !== null}
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSaveError(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {saveError}
        </Alert>
      </Snackbar>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t('themeEditor.deleteTheme')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('themeEditor.deleteConfirm', { name: themeName })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              handleDelete();
            }}
            color="error"
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </NavLayout>
  );
}
