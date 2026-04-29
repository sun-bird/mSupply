import {
  Delete02Icon,
  DownloadCircle02Icon,
  MoreHorizontalIcon,
  Share01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TenderDocument {
  id: string;
  name: string;
  uploadDate: string;
}

interface DocumentListProps {
  documents: TenderDocument[];
  onRemove: (id: string) => void;
}

/**
 * Derive a short, uppercase file-type label and a tinted colour from a
 * filename. Falls back to "FILE" with a neutral colour when the extension is
 * missing or unrecognised. Colours are loose conventions (red = PDF,
 * green = spreadsheet, blue = Word, etc) — all rendered against a 12% tint.
 */
function getFileTypeBadge(name: string): { label: string; color: string } {
  const dot = name.lastIndexOf('.');
  if (dot < 0 || dot === name.length - 1) {
    return { label: 'FILE', color: '#6B7280' };
  }
  const ext = name.slice(dot + 1).toLowerCase();

  const KNOWN: Record<string, { label: string; color: string }> = {
    pdf: { label: 'PDF', color: '#E53535' },
    doc: { label: 'DOC', color: '#2B6CB0' },
    docx: { label: 'DOCX', color: '#2B6CB0' },
    xls: { label: 'XLS', color: '#1F8E3D' },
    xlsx: { label: 'XLSX', color: '#1F8E3D' },
    csv: { label: 'CSV', color: '#1F8E3D' },
    ppt: { label: 'PPT', color: '#D04A1F' },
    pptx: { label: 'PPTX', color: '#D04A1F' },
    txt: { label: 'TXT', color: '#6B7280' },
    rtf: { label: 'RTF', color: '#6B7280' },
    zip: { label: 'ZIP', color: '#7C3AED' },
    rar: { label: 'RAR', color: '#7C3AED' },
    '7z': { label: '7Z', color: '#7C3AED' },
    png: { label: 'PNG', color: '#0891B2' },
    jpg: { label: 'JPG', color: '#0891B2' },
    jpeg: { label: 'JPG', color: '#0891B2' },
    gif: { label: 'GIF', color: '#0891B2' },
    svg: { label: 'SVG', color: '#0891B2' },
    webp: { label: 'WEBP', color: '#0891B2' },
  };

  if (KNOWN[ext]) return KNOWN[ext];
  // Unknown extension — show it raw, capped at 4 chars so the badge stays
  // readable.
  return { label: ext.slice(0, 4).toUpperCase(), color: '#6B7280' };
}

/** Hex (#RRGGBB) -> rgba string with the given alpha. */
function hexToRgba(hex: string, alpha: number): string {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export default function DocumentList({ documents, onRemove }: DocumentListProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuDocId, setMenuDocId] = useState<string | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, docId: string) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuDocId(docId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDocId(null);
  };

  const handleRemove = () => {
    if (menuDocId) onRemove(menuDocId);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {documents.map((doc) => {
        const badge = getFileTypeBadge(doc.name);
        return (
        <Box
          key={doc.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.5,
            px: 1,
            borderRadius: '8px',
            transition: 'background 0.1s',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {/* File-type badge — colour and label derived from the extension.
              Wrapped in a fixed-width column so file names line up across
              rows regardless of badge label length (PDF vs DOCX vs WEBP). */}
          <Box sx={{ width: 47, flexShrink: 0, display: 'flex', justifyContent: 'flex-start' }}>
            <Box
              sx={{
                minWidth: 28,
                maxWidth: '100%',
                height: 28,
                px: 0.75,
                borderRadius: '6px',
                bgcolor: hexToRgba(badge.color, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: badge.color, fontFamily: 'Inter, sans-serif' }}>
                {badge.label}
              </Typography>
            </Box>
          </Box>

          {/* Document name */}
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'text.primary',
              flex: 1,
            }}
          >
            {doc.name}
          </Typography>

          {/* Upload date */}
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {doc.uploadDate}
          </Typography>

          {/* Ellipsis menu */}
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, doc.id)}
            sx={{ color: '#3E7BFA' }}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
          </IconButton>
        </Box>
        );
      })}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px',
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <HugeiconsIcon icon={DownloadCircle02Icon} size={18} color="currentColor" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ sx: { fontSize: 12, fontFamily: 'Inter, sans-serif' } }}>{t('tenderPlan.downloadDocument')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <HugeiconsIcon icon={Share01Icon} size={18} color="currentColor" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ sx: { fontSize: 12, fontFamily: 'Inter, sans-serif' } }}>{t('tenderPlan.viewInNewTab')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRemove} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <HugeiconsIcon icon={Delete02Icon} size={18} color="#E53535" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ sx: { fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#E53535' } }}>{t('tenderPlan.removeDocument')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
