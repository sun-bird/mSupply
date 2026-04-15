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
      {documents.map((doc) => (
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
          {/* PDF icon */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              bgcolor: 'rgba(229,53,53,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#E53535', fontFamily: 'Inter, sans-serif' }}>
              PDF
            </Typography>
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
      ))}

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
