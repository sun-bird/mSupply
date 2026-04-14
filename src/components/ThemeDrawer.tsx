import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface ThemeDrawerProps {
  title: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function ThemeDrawer({
  title,
  icon,
  open,
  onToggle,
  children,
}: ThemeDrawerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Header */}
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { opacity: 0.8 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>{icon}</Box>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              lineHeight: '24px',
              color: '#1C1C28',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} timeout="auto">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '10px',
            boxShadow: '0px 0px 2px 0px rgba(40,41,61,0.04), 0px 4px 8px 0px rgba(96,97,112,0.16)',
            px: '20px',
            pt: '10px',
            pb: '20px',
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
