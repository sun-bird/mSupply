import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Comment01Icon,
  DeliveryTruck02Icon,
} from '@hugeicons/core-free-icons';
// Note: ArrowLeft01Icon is reused for both the header back button and the
// footer prev-item navigation arrow.
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Evaluation states for a supplier bid. The user can switch between
 *  these via the dropdown chip on each row. */
export type BidStatus = 'Accept' | 'Preferred' | 'Disqualify' | 'Not Evaluated';

/** A single supplier's bid row for one tender item. */
export interface SupplierBid {
  supplier: string;
  manufacturer: string;
  unitType: string;
  packSize: number;
  packs: number;
  totalUnits: number;
  deliveryWeeks: number;
  /** Mode of delivery — affects which icon shows next to the weeks text. */
  deliveryMode: 'truck' | 'ship';
  expiry: string;
  pricePerPack: string;
  /** Local-currency conversion line shown beneath the price, e.g. "NZD 18.50". */
  priceLocal?: string;
  status: BidStatus;
  hasComment?: boolean;
}

/** What the modal needs to know about the item being evaluated. */
export interface EvaluateItemSummary {
  itemCode: string;
  itemName: string;
  unitType: string;
  packSize: number;
  numberOfPacks: number;
  totalUnits: number;
}

interface EvaluateItemDialogProps {
  open: boolean;
  /** Primary header text — typically the parent tender's serial +
   *  description (e.g. "TN-0044 Surgical Instruments"). */
  tenderTitle: string;
  /** 1-based current item index. */
  index: number;
  /** Total number of items being walked through (for "1/24" header). */
  total: number;
  item: EvaluateItemSummary | null;
  bids: SupplierBid[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const STATUS_COLORS: Record<BidStatus, { bg: string; color: string }> = {
  // Accept reuses the Preferred palette so an "acceptable" decision shares
  // the same visual weight as the chosen Preferred supplier.
  Accept: { bg: 'rgba(5,166,96,0.18)', color: '#05813E' },
  Preferred: { bg: 'rgba(5,166,96,0.18)', color: '#05813E' },
  Disqualify: { bg: 'rgba(229,53,53,0.15)', color: '#B12626' },
  'Not Evaluated': { bg: 'rgba(28,28,40,0.06)', color: '#555770' },
};

const STATUS_OPTIONS: BidStatus[] = ['Accept', 'Preferred', 'Disqualify', 'Not Evaluated'];

/**
 * Per-item evaluation modal (matches Figma node 6230-30600). Shown as a
 * floating rounded card over a dimmed backdrop. The header walks through
 * items in order via the prev/next round buttons in the footer; the centre
 * "NEXT" CTA confirms the current decision and advances.
 */
export default function EvaluateItemDialog({
  open,
  tenderTitle,
  index,
  total,
  item,
  bids,
  onClose,
  onPrev,
  onNext,
}: EvaluateItemDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [priceBlind, setPriceBlind] = useState(false);
  const [sortKey, setSortKey] = useState<keyof SupplierBid | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Per-row evaluation status — keyed by the bid's index in `bids`. Falls
  // back to the bid's own `status` when the user hasn't changed it yet.
  const [statusOverrides, setStatusOverrides] = useState<Record<number, BidStatus>>({});
  // Anchor element + row index for the status dropdown menu.
  const [statusMenu, setStatusMenu] = useState<{ row: number; el: HTMLElement } | null>(null);

  // Reset the Price Blind toggle and sort state whenever the modal closes
  // so they don't bleed into the next item the user opens.
  useEffect(() => {
    if (!open) {
      setPriceBlind(false);
      setSortKey(null);
      setSortDir('asc');
      setStatusOverrides({});
      setStatusMenu(null);
    }
  }, [open]);

  // Wipe overrides when the user navigates to a different item so each
  // item starts from the seed status set.
  useEffect(() => {
    setStatusOverrides({});
    setStatusMenu(null);
  }, [index]);

  // Each column declares the bid field it reads from + a renderer so the
  // table acts as a real data grid: header label drives sorting, body
  // cells map the SupplierBid object to display content.
  const columns = useMemo(
    () => [
      { key: 'supplier' as const, label: t('evaluateItemDialog.supplier'), render: (b: SupplierBid) => b.supplier },
      { key: 'manufacturer' as const, label: t('evaluateItemDialog.manufacturer'), render: (b: SupplierBid) => b.manufacturer },
      { key: 'unitType' as const, label: t('evaluateItemDialog.unitType'), render: (b: SupplierBid) => b.unitType },
      { key: 'packSize' as const, label: t('evaluateItemDialog.packSize'), render: (b: SupplierBid) => b.packSize },
      { key: 'packs' as const, label: t('evaluateItemDialog.packs'), render: (b: SupplierBid) => b.packs },
      { key: 'totalUnits' as const, label: t('evaluateItemDialog.totalUnits'), render: (b: SupplierBid) => b.totalUnits },
      {
        key: 'deliveryWeeks' as const,
        label: t('evaluateItemDialog.delivery'),
        render: (b: SupplierBid) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box component="span">{t('evaluateItemDialog.weeks', { count: b.deliveryWeeks })}</Box>
            <HugeiconsIcon
              icon={DeliveryTruck02Icon}
              size={14}
              color={b.deliveryMode === 'ship' ? '#555770' : '#1C1C28'}
            />
          </Box>
        ),
      },
      { key: 'expiry' as const, label: t('evaluateItemDialog.expiry'), render: (b: SupplierBid) => b.expiry },
      {
        key: 'pricePerPack' as const,
        label: t('evaluateItemDialog.pricePerPack'),
        render: (b: SupplierBid) =>
          // Default state hides the actual figures behind asterisks; the
          // user has to flip the Price Blind toggle on to reveal them.
          priceBlind ? (
            <Box>
              <Box>{b.pricePerPack}</Box>
              {b.priceLocal && (
                <Box sx={{ color: 'text.secondary', fontSize: 11 }}>({b.priceLocal})</Box>
              )}
            </Box>
          ) : (
            <Box sx={{ color: 'text.disabled', letterSpacing: 1 }}>****</Box>
          ),
      },
    ],
    [t, priceBlind],
  );

  // Column is always rendered; the Price per Pack cell content is what
  // toggles between obfuscated asterisks and the real values.
  const visibleColumns = columns;

  const sortedBids = useMemo(() => {
    if (!sortKey) return bids;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...bids].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [bids, sortKey, sortDir]);

  const toggleSort = (key: keyof SupplierBid) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (!item) return null;

  const summaryFields: Array<{ label: string; value: string | number }> = [
    { label: t('evaluateItemDialog.unitType'), value: item.unitType },
    { label: t('evaluateItemDialog.packSize'), value: item.packSize },
    { label: t('evaluateItemDialog.numberPacks'), value: item.numberOfPacks },
    { label: t('evaluateItemDialog.totalUnits'), value: item.totalUnits },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      {/* Header — mirrors the Tender summary view's NavLayout header
          styling (back button + title with secondary detail) so the modal
          reads as a "go deeper" navigation step. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 5,
          py: 3,
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t('common.goBack')}
          sx={{ color: 'primary.main', flexShrink: 0, mr: 0.5 }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={3} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 18,
            color: 'text.secondary',
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {tenderTitle}{' '}
          <Box component="span" sx={{ fontWeight: 500 }}>
            {t('evaluateItemDialog.headerItem', { index, total })}
          </Box>
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={priceBlind}
              onChange={(e) => setPriceBlind(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.secondary' }}>
              {t('evaluateItemDialog.priceBlind')}
            </Typography>
          }
          sx={{ mr: 1 }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 5, pb: 3 }}>
        {/* Product Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 4,
            bgcolor: 'action.hover',
            borderRadius: '12px',
            px: 3,
            py: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: 'text.secondary',
                lineHeight: 1.4,
              }}
            >
              {item.itemCode}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 20,
                color: 'text.primary',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.itemName}
            </Typography>
            <Box
              component="button"
              type="button"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: 'transparent',
                border: 'none',
                p: 0,
                mt: '10px',
                cursor: 'pointer',
                color: '#3E7BFA',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                lineHeight: 1.4,
                '&:hover .underline': { textDecorationColor: '#3E7BFA' },
              }}
            >
              <HugeiconsIcon icon={Comment01Icon} size={14} color="#3E7BFA" />
              <Box component="span" className="underline" sx={{ textDecoration: 'underline' }}>
                {t('evaluateItemDialog.showConditions')}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 4, rowGap: 0, flexShrink: 0 }}>
            {summaryFields.map((f) => (
              <Box key={f.label} sx={{ display: 'contents' }}>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.35, color: 'text.secondary' }}>
                  {f.label}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.35, color: 'text.primary', textAlign: 'right' }}>
                  {f.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Suppliers table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* Comment column moved to the start of the row so the
                    chat icon sits on the left edge. No header label. */}
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', width: 36, px: 1 }} />
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'text.secondary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      verticalAlign: 'bottom',
                      lineHeight: '16px',
                      px: 1,
                    }}
                  >
                    <TableSortLabel
                      active={sortKey === col.key}
                      direction={sortKey === col.key ? sortDir : 'asc'}
                      onClick={() => toggleSort(col.key)}
                      sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', '&.Mui-active': { color: 'text.secondary' } }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {/* Status pill + accept/reject ticks have no header label. */}
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBids.map((bid, i) => {
                // Bids start as "Not Evaluated" by default — the user
                // explicitly picks Accept / Preferred / Disqualify from the
                // chip dropdown as they review each one. The seed status
                // on the SupplierBid is preserved on the type but not used
                // as the visual default.
                const status = statusOverrides[i] ?? 'Not Evaluated';
                const statusStyle = STATUS_COLORS[status];
                const isActive = bid.hasComment;
                return (
                  <TableRow
                    key={i}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      ...(isActive && { bgcolor: 'rgba(62,123,250,0.04)' }),
                    }}
                  >
                    <TableCell sx={{ ...cellSx, width: 36, px: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: isActive ? '#3E7BFA' : 'text.secondary',
                          bgcolor: isActive ? 'rgba(62,123,250,0.08)' : 'transparent',
                          '&:hover': { color: '#3E7BFA', bgcolor: 'rgba(62,123,250,0.08)' },
                        }}
                      >
                        <HugeiconsIcon icon={Comment01Icon} size={14} />
                      </IconButton>
                    </TableCell>
                    {visibleColumns.map((col) => (
                      <TableCell key={col.key} sx={cellSx}>
                        {col.render(bid)}
                      </TableCell>
                    ))}
                    {/* Accept / Disqualify quick-decision checkboxes —
                        each one drives the row's status: checking the
                        Accept tick sets the row to Accept, checking the
                        Disqualify tick sets it to Disqualify. Unchecking
                        rolls back to Not Evaluated. */}
                    <TableCell sx={{ ...cellSx, py: '8px', whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Checkbox
                          size="small"
                          aria-label={t('evaluateItemDialog.accept')}
                          checked={status === 'Accept'}
                          // Decide based on React state, not the DOM's
                          // checked attribute, so the two checkboxes can
                          // never end up both checked. Clicking the active
                          // tick reverts to Not Evaluated; clicking the
                          // inactive one switches the row to Accept and
                          // the Disqualify tick re-renders as unchecked
                          // because `checked={status === 'Disqualify'}` is
                          // now false.
                          onClick={() =>
                            setStatusOverrides((prev) => ({
                              ...prev,
                              [i]: status === 'Accept' ? 'Not Evaluated' : 'Accept',
                            }))
                          }
                          sx={{
                            p: 0.5,
                            color: STATUS_COLORS.Accept.color,
                            '&.Mui-checked': {
                              color: STATUS_COLORS.Accept.color,
                              bgcolor: STATUS_COLORS.Accept.bg,
                            },
                            '& .MuiSvgIcon-root': { fontSize: 20 },
                          }}
                        />
                        <Checkbox
                          size="small"
                          aria-label={t('evaluateItemDialog.reject')}
                          checked={status === 'Disqualify'}
                          onClick={() =>
                            setStatusOverrides((prev) => ({
                              ...prev,
                              [i]: status === 'Disqualify' ? 'Not Evaluated' : 'Disqualify',
                            }))
                          }
                          sx={{
                            p: 0.5,
                            color: STATUS_COLORS.Disqualify.color,
                            '&.Mui-checked': {
                              color: STATUS_COLORS.Disqualify.color,
                              bgcolor: STATUS_COLORS.Disqualify.bg,
                            },
                            '& .MuiSvgIcon-root': { fontSize: 20 },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...cellSx, py: '8px' }}>
                      <Chip
                        label={status}
                        size="small"
                        clickable
                        onClick={(e) => setStatusMenu({ row: i, el: e.currentTarget })}
                        onDelete={(e: React.SyntheticEvent) =>
                          setStatusMenu({ row: i, el: e.currentTarget as HTMLElement })
                        }
                        deleteIcon={
                          <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" />
                        }
                        sx={{
                          bgcolor: statusStyle.bg,
                          color: statusStyle.color,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: 12,
                          height: 24,
                          borderRadius: '100px',
                          px: 1,
                          cursor: 'pointer',
                          '& .MuiChip-label': { px: 1 },
                          '& .MuiChip-deleteIcon': {
                            color: statusStyle.color,
                            '&:hover': { color: statusStyle.color, opacity: 0.8 },
                          },
                          '&:hover': { bgcolor: statusStyle.bg, filter: 'brightness(0.95)' },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Status dropdown — anchored to whichever Chip the user clicked. */}
      <Menu
        open={statusMenu !== null}
        anchorEl={statusMenu?.el ?? null}
        onClose={() => setStatusMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: '8px', minWidth: 160 } } }}
      >
        {STATUS_OPTIONS.map((opt) => {
          const optStyle = STATUS_COLORS[opt];
          return (
            <MenuItem
              key={opt}
              onClick={() => {
                if (statusMenu) {
                  setStatusOverrides((prev) => ({ ...prev, [statusMenu.row]: opt }));
                }
                setStatusMenu(null);
              }}
              sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, gap: 1 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: optStyle.color,
                  flexShrink: 0,
                }}
              />
              {opt}
            </MenuItem>
          );
        })}
      </Menu>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 5,
          py: 3,
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onPrev}
          disabled={index <= 1}
          aria-label={t('evaluateItemDialog.previous')}
          sx={navBtnSx(primaryColor)}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </IconButton>

        <Button
          variant="contained"
          onClick={onNext}
          sx={{
            bgcolor: '#3E7BFA',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderRadius: '24px',
            px: 5,
            py: 1.25,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#3E7BFA',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
              filter: 'brightness(1.1)',
            },
          }}
        >
          {t('evaluateItemDialog.next')}
        </Button>

        <IconButton
          onClick={onNext}
          disabled={index >= total}
          aria-label={t('evaluateItemDialog.nextItem')}
          sx={navBtnSx(primaryColor)}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </IconButton>
      </Box>
    </Dialog>
  );
}

const cellSx = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  color: 'text.primary',
  py: '14px',
  // Compress the horizontal gutter (MUI's small-size default is 16px on
  // each side) so the table doesn't have huge whitespace between the
  // narrow numeric columns. 8px keeps the columns visually distinct
  // without making them feel padded.
  px: 1,
};

const navBtnSx = (primary: string) => ({
  width: 40,
  height: 40,
  bgcolor: 'background.paper',
  color: 'text.secondary',
  boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
  '&:hover': { color: primary, bgcolor: 'background.paper', boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
  '&.Mui-disabled': { color: 'text.disabled', boxShadow: '0px 0px 2px rgba(40,41,61,0.04)' },
});
