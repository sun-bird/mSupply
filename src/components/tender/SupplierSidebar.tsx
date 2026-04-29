import { ArrowDown01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Box, Collapse, IconButton, InputBase, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
  /** When this number changes (and is non-zero), the section force-opens. */
  forceOpenKey?: number;
  children?: React.ReactNode;
}

function Section({ title, defaultOpen = false, forceOpenKey, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (forceOpenKey && forceOpenKey > 0) setOpen(true);
  }, [forceOpenKey]);
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
  /** Optional close handler; when provided an X button appears in the header. */
  onClose?: () => void;
  /**
   * When this number changes (and is non-zero), the Comments section is
   * force-opened, scrolled into view, the textarea focused, and a brief
   * outline flashes to draw the user's attention. Used by the in-table
   * comment icon to deep-link straight to a supplier's note.
   */
  highlightCommentsKey?: number;
}

export default function SupplierSidebar({ supplier, onCommentChange, onClose, highlightCommentsKey }: SupplierSidebarProps) {
  const { t } = useTranslation();
  const commentsSectionRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!highlightCommentsKey) return;
    // Defer so the Section's force-open transition has a chance to render
    // before we measure/scroll.
    const id = window.setTimeout(() => {
      commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      commentInputRef.current?.focus();
    }, 50);
    setFlashing(true);
    const fadeId = window.setTimeout(() => setFlashing(false), 1200);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(fadeId);
    };
  }, [highlightCommentsKey]);

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
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'text.secondary' }}>
            {supplier.code}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', lineHeight: '22px' }}>
            {supplier.name}
          </Typography>
        </Box>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close"
            sx={{ color: 'text.secondary', mt: -0.5, mr: -0.5 }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </IconButton>
        )}
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
      <Box
        ref={commentsSectionRef}
        sx={{
          transition: 'box-shadow 0.4s ease, background-color 0.4s ease',
          boxShadow: flashing
            ? 'inset 0 0 0 2px #3E7BFA'
            : 'inset 0 0 0 0 rgba(62,123,250,0)',
          bgcolor: flashing ? 'rgba(62,123,250,0.08)' : 'transparent',
        }}
      >
        <Section
          title={t('tenderSource.commentsInternal')}
          defaultOpen
          forceOpenKey={highlightCommentsKey}
        >
          <InputBase
            multiline
            minRows={2}
            inputRef={commentInputRef}
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
    </Box>
  );
}
