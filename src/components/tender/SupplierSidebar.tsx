import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Collapse, IconButton, InputBase, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Supplier {
  code: string;
  name: string;
  performance: number;
  dateSent: string;
  dateResponded: string;
  totalBid: string;
  tenderValue: number;
  totalOnPO: number;
  checked: boolean;
  pastBids: number;
  tendersWon: number;
  deliveryOnTime: number;
  comment: string;
}

function perfColor(value: number): string {
  if (value >= 95) return '#05A660';
  if (value >= 70) return '#FDAC42';
  return '#E53535';
}

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: 'text.primary' }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

interface SupplierSidebarProps {
  supplier: Supplier;
  onCommentChange?: (code: string, comment: string) => void;
}

export default function SupplierSidebar({ supplier, onCommentChange }: SupplierSidebarProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 300,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 12px rgba(0,0,0,0.08)',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'text.secondary' }}>
          {supplier.code}
        </Typography>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', lineHeight: '22px' }}>
          {supplier.name}
        </Typography>
      </Box>

      {/* Performance */}
      <Section title={t('tenderSource.performance')} defaultOpen>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'text.secondary' }}>
              {t('tenderSource.pastBids')}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
              {supplier.pastBids}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'text.secondary' }}>
              {t('tenderSource.tendersWon')}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
              {supplier.tendersWon}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'text.secondary' }}>
              {t('tenderSource.deliveryOnTime')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: perfColor(supplier.deliveryOnTime) }} />
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
                {supplier.deliveryOnTime}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Section>

      {/* Contact Details */}
      <Section title={t('tenderSource.contactDetails')} />

      {/* Past Tenders */}
      <Section title={t('tenderSource.pastTenders')} />

      {/* Comments */}
      <Section title={t('tenderSource.commentsInternal')} defaultOpen>
        <InputBase
          multiline
          minRows={2}
          placeholder={t('tenderSource.commentPlaceholder')}
          value={supplier.comment}
          onChange={(e) => onCommentChange?.(supplier.code, e.target.value)}
          sx={{
            width: '100%',
            minHeight: 40,
            bgcolor: 'action.hover',
            borderRadius: '8px',
            p: 1.5,
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'text.primary',
            lineHeight: '20px',
            alignItems: 'flex-start',
          }}
        />
      </Section>
    </Box>
  );
}
