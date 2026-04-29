import {
  Csv01Icon,
  Delete02Icon,
  Doc01Icon,
  DownloadCircle02Icon,
  File01Icon,
  Image01Icon,
  MoreHorizontalIcon,
  Pdf01Icon,
  Ppt01Icon,
  Share01Icon,
  Xls01Icon,
  Zip01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
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
 * Pick a Hugeicons icon and accent colour for a filename based on its
 * extension. Falls back to a neutral File01Icon when the extension is missing
 * or unrecognised. Colours are loose conventions (red = PDF, green =
 * spreadsheet, blue = Word, etc).
 */
function getFileTypeIcon(name: string): { icon: IconSvgElement; color: string } {
  const FALLBACK = { icon: File01Icon, color: '#6B7280' };
  const dot = name.lastIndexOf('.');
  if (dot < 0 || dot === name.length - 1) return FALLBACK;
  const ext = name.slice(dot + 1).toLowerCase();

  const KNOWN: Record<string, { icon: IconSvgElement; color: string }> = {
    pdf: { icon: Pdf01Icon, color: '#E53535' },
    doc: { icon: Doc01Icon, color: '#2B6CB0' },
    docx: { icon: Doc01Icon, color: '#2B6CB0' },
    rtf: { icon: Doc01Icon, color: '#2B6CB0' },
    txt: { icon: Doc01Icon, color: '#6B7280' },
    xls: { icon: Xls01Icon, color: '#1F8E3D' },
    xlsx: { icon: Xls01Icon, color: '#1F8E3D' },
    csv: { icon: Csv01Icon, color: '#1F8E3D' },
    ppt: { icon: Ppt01Icon, color: '#D04A1F' },
    pptx: { icon: Ppt01Icon, color: '#D04A1F' },
    zip: { icon: Zip01Icon, color: '#7C3AED' },
    rar: { icon: Zip01Icon, color: '#7C3AED' },
    '7z': { icon: Zip01Icon, color: '#7C3AED' },
    png: { icon: Image01Icon, color: '#0891B2' },
    jpg: { icon: Image01Icon, color: '#0891B2' },
    jpeg: { icon: Image01Icon, color: '#0891B2' },
    gif: { icon: Image01Icon, color: '#0891B2' },
    svg: { icon: Image01Icon, color: '#0891B2' },
    webp: { icon: Image01Icon, color: '#0891B2' },
  };

  return KNOWN[ext] ?? FALLBACK;
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
        const fileType = getFileTypeIcon(doc.name);
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
          {/* File-type icon — Hugeicon picked from the extension. Wrapped in
              a fixed-width column so file names line up across rows. */}
          <Box
            sx={{
              width: 32,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: fileType.color,
            }}
          >
            <HugeiconsIcon icon={fileType.icon} size={24} color="currentColor" />
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
