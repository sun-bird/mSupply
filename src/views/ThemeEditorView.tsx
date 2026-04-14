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
  Box,
  Button,
  IconButton,
  MenuItem,
  Popover,
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
          color: '#1C1C28',
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
          bgcolor: 'white',
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
              color: '#555770',
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayUrl = previewUrl || defaultUrl || null;

  const handleFile = (file: File) => {
    if (file.size > MAX_LOGO_SIZE) {
      setError('File exceeds 1 MB limit');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
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
              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography sx={{ fontSize: 12, color: '#555770', lineHeight: '16px' }}>
                Drag & drop or tap to upload logo
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
              bgcolor: 'white',
              boxShadow: '0px 1px 4px rgba(0,0,0,0.15)',
              width: 28,
              height: 28,
              '&:hover': { bgcolor: '#f5f5f5' },
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
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
    const t = savedThemes.find((s) => s.id === id);
    if (!t) return;
    setEditingId(t.id);
    setThemeName(t.themeName);
    setPrimaryColor(t.primaryColor);
    setSecondaryColor(t.secondaryColor);
    setLogoFile(null);
    setLogoPreviewUrl(t.logoDataUrl);
    if (t.logoDataUrl) onLogoChange(t.logoDataUrl);
    else onLogoChange(null);
    setSnapshot({
      themeName: t.themeName,
      primaryColor: t.primaryColor,
      secondaryColor: t.secondaryColor,
      logoPreviewUrl: t.logoDataUrl,
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

    let logoDataUrl: string | null = logoPreviewUrl;
    // If a new file was uploaded, convert to data URL for persistence
    if (logoFile) {
      logoDataUrl = await fileToDataUrl(logoFile);
    }

    const theme: SavedTheme = {
      id: editingId ?? crypto.randomUUID(),
      themeName: themeName.trim(),
      primaryColor,
      secondaryColor,
      logoDataUrl,
    };

    onSaveTheme(theme);
    setEditingId(theme.id);
    setLogoFile(null);
    setLogoPreviewUrl(logoDataUrl);
    setSnapshot({
      themeName: theme.themeName,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      logoPreviewUrl: logoDataUrl,
    });
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
        title: 'Theme Editor',
        onBack: () => onNavigate('/dashboard'),
        primaryAction: {
          label: 'Create Theme',
          icon: <HugeiconsIcon icon={AddCircleIcon} size={24} />,
          onClick: () => loadTheme('__new__'),
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
          title="Theme Information"
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
                  sx={{ width: 180, flexShrink: 0, fontWeight: 500, fontSize: 14, lineHeight: '16px', color: '#1C1C28', textAlign: 'left' }}
                >
                  Theme
                </Typography>
                <Select
                  value={editingId ?? '__new__'}
                  onChange={(e) => loadTheme(e.target.value as string)}
                  size="small"
                  sx={{
                    width: { xs: 180, sm: 260 },
                    flexShrink: 0,
                    bgcolor: 'white',
                    borderRadius: '10px',
                    boxShadow: BTN_SHADOW,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { textAlign: 'left' },
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#555770',
                  }}
                >
                  {savedThemes.map((t) => (
                    <MenuItem key={t.id} value={t.id} sx={{ fontSize: 12 }}>
                      {t.themeName}
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
                  sx={{ width: 180, flexShrink: 0, fontWeight: 500, fontSize: 14, lineHeight: '16px', color: '#1C1C28', textAlign: 'left' }}
                >
                  Theme Name <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: 180, sm: 260 },
                    flexShrink: 0,
                    height: 40,
                    bgcolor: 'white',
                    borderRadius: '10px',
                    boxShadow: BTN_SHADOW,
                    px: '10px',
                  }}
                >
                  <TextField
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value.slice(0, 40))}
                    variant="standard"
                    placeholder="Enter theme name"
                    InputProps={{ disableUnderline: true }}
                    inputProps={{ maxLength: 40 }}
                    error={!themeName.trim() || isDuplicateName}
                    helperText={isDuplicateName ? 'Name already exists' : undefined}
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-input': {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '16px',
                        color: '#555770',
                        p: 0,
                      },
                    }}
                  />
                </Box>
              </Box>

              <ColorField label="Primary Brand Colour" value={primaryColor} onChange={setPrimaryColor} required />
              <ColorField label="Secondary Brand Colour" value={secondaryColor} onChange={setSecondaryColor} />
            </Box>

            {/* Logo drop zone — centered vertically beside all form fields */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pr: '40px' }}>
              <LogoDropZone previewUrl={logoPreviewUrl} defaultUrl={msupplyLogo} onFileChange={handleLogoFile} />
            </Box>
          </Box>

        </ThemeDrawer>

        {/* Drawer 2: Editor */}
        <ThemeDrawer
          title="Editor"
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
              color: jsonError ? '#d32f2f' : '#000',
              border: jsonError ? '1px solid #d32f2f' : 'none',
              outline: 'none',
              resize: 'vertical',
              p: 0,
              bgcolor: 'transparent',
              whiteSpace: 'pre',
              overflowX: 'auto',
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
          }}
        >
          {/* Delete — only for existing saved themes */}
          {isExistingTheme && (
            <Button
              onClick={handleDelete}
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
                bgcolor: 'white',
                boxShadow: BTN_SHADOW,
                px: '20px',
                '&:hover': { bgcolor: '#fef2f2' },
              }}
            >
              Delete
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
              bgcolor: 'white',
              boxShadow: BTN_SHADOW,
              px: '20px',
              '&:hover': { bgcolor: '#f0f4ff' },
            }}
          >
            Cancel
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
            Save
          </Button>
        </Box>
      </Box>
    </NavLayout>
  );
}
