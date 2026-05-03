import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
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
  InputBase,
  LinearProgress,
  Menu,
  MenuItem,
  Switch,
  SvgIcon,
  Table,
  ToggleButton,
  ToggleButtonGroup,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
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
  /** Which A/B-test variant to open in. Defaults to 'A' but the
   *  banner's "Evaluate Bids" CTA can route directly to 'B'. */
  initialVersion?: 'A' | 'B';
}

// Status palette factory — derives chip/tick colors from the active
// theme so the modal works in both light and dark modes. The hue stays
// constant (green for accept, red for disqualify, neutral for not
// evaluated) but the lightness flips with the mode.
const getStatusColors = (
  theme: import('@mui/material/styles').Theme,
): Record<BidStatus, { bg: string; color: string }> => {
  const isDark = theme.palette.mode === 'dark';
  return {
    Accept: {
      bg: isDark ? 'rgba(245,158,11,0.28)' : 'rgba(245,158,11,0.18)',
      color: isDark ? '#FCD34D' : '#B45309',
    },
    Preferred: {
      bg: isDark ? 'rgba(5,166,96,0.28)' : 'rgba(5,166,96,0.18)',
      color: isDark ? '#4ED9A0' : '#05813E',
    },
    Disqualify: {
      bg: isDark ? 'rgba(229,53,53,0.28)' : 'rgba(229,53,53,0.15)',
      color: isDark ? '#FF8F8F' : '#B12626',
    },
    'Not Evaluated': {
      bg: alpha(theme.palette.text.primary, isDark ? 0.12 : 0.06),
      color: theme.palette.text.secondary,
    },
  };
};

const STATUS_OPTIONS: BidStatus[] = ['Accept', 'Preferred', 'Disqualify', 'Not Evaluated'];

// Rounded outlined-square used for the accept/reject checkboxes — the
// default MUI checkbox icon has a 2px radius built in, this gives the
// quick-decision ticks a slightly softer 4px corner that matches the
// chip/button radii elsewhere in the modal.
const RoundedCheckboxIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4"
      ry="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </SvgIcon>
);

// Filled variant used when a checkbox is in the "checked" state — a
// rounded square solid in the current color, with a thin contrast tick
// drawn over the top.
const RoundedCheckboxCheckedIcon = () => (
  <SvgIcon sx={{ fontSize: 18 }}>
    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" fill="currentColor" />
    <path
      d="M7.5 12.5l3 3 6-6.5"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);

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
  initialVersion = 'A',
}: EvaluateItemDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const statusColors = getStatusColors(theme);
  // Below the sm breakpoint the segmented combo button is too wide for
  // a table cell; collapse it to the chip+menu dropdown that Variant B
  // uses so each row only takes one tap-target's worth of space.
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [priceBlind, setPriceBlind] = useState(false);
  const [sortKey, setSortKey] = useState<keyof SupplierBid | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Per-row evaluation status — keyed by the bid's index in `bids`. Falls
  // back to the bid's own `status` when the user hasn't changed it yet.
  const [statusOverrides, setStatusOverrides] = useState<Record<number, BidStatus>>({});
  // Anchor element + row index for the status dropdown menu.
  const [statusMenu, setStatusMenu] = useState<{ row: number; el: HTMLElement } | null>(null);
  // Rows whose comment field is currently expanded — keyed by bid index.
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  // Per-row comment text. Persists across expand/collapse so the user
  // doesn't lose what they typed if they hide and re-show the field.
  const [comments, setComments] = useState<Record<number, string>>({});
  // Master "Show all Comments" toggle in the header — flipping it expands
  // or collapses every row in one shot.
  const [showAllComments, setShowAllComments] = useState(false);
  // A/B-testing toggle in the header — version A shows the current
  // layout, version B renders a parallel duplicate for side-by-side
  // experimentation. Seeded from initialVersion so callers can route
  // the banner CTA straight into B.
  const [version, setVersion] = useState<'A' | 'B'>(initialVersion);

  // Reset the Price Blind toggle and sort state whenever the modal closes
  // so they don't bleed into the next item the user opens.
  useEffect(() => {
    if (open) {
      // Snap the variant back to whatever the caller asked for whenever
      // the dialog reopens, so the "Evaluate Bids" CTA reliably lands
      // on B even if the user previously toggled to A inside the
      // modal.
      setVersion(initialVersion);
    } else {
      setPriceBlind(false);
      setSortKey(null);
      setSortDir('asc');
      setStatusOverrides({});
      setStatusMenu(null);
      setExpandedComments(new Set());
      setComments({});
      setShowAllComments(false);
    }
  }, [open, initialVersion]);

  // Wipe overrides when the user navigates to a different item so each
  // item starts from the seed status set.
  useEffect(() => {
    setStatusOverrides({});
    setStatusMenu(null);
    setExpandedComments(new Set());
    setShowAllComments(false);
  }, [index]);

  // Each column declares the bid field it reads from + a renderer so the
  // table acts as a real data grid: header label drives sorting, body
  // cells map the SupplierBid object to display content.
  const columns = useMemo(
    () => [
      { key: 'supplier' as const, label: t('evaluateItemDialog.supplier'), render: (b: SupplierBid) => b.supplier },
      { key: 'manufacturer' as const, label: t('evaluateItemDialog.manufacturer'), render: (b: SupplierBid) => b.manufacturer },
      { key: 'unitType' as const, label: 'Unit\nType', render: (b: SupplierBid) => b.unitType },
      { key: 'packSize' as const, label: 'Pack\nSize', render: (b: SupplierBid) => b.packSize },
      { key: 'packs' as const, label: t('evaluateItemDialog.packs'), render: (b: SupplierBid) => b.packs },
      { key: 'totalUnits' as const, label: 'Total\nUnits', render: (b: SupplierBid) => b.totalUnits },
      {
        key: 'deliveryWeeks' as const,
        label: t('evaluateItemDialog.delivery'),
        render: (b: SupplierBid) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box component="span">{t('evaluateItemDialog.weeks', { count: b.deliveryWeeks })}</Box>
            <HugeiconsIcon
              icon={DeliveryTruck02Icon}
              size={14}
              color={
                b.deliveryMode === 'ship'
                  ? theme.palette.text.secondary
                  : theme.palette.text.primary
              }
            />
          </Box>
        ),
      },
      { key: 'expiry' as const, label: t('evaluateItemDialog.expiry'), render: (b: SupplierBid) => b.expiry },
      {
        key: 'pricePerPack' as const,
        label: 'Pack\nPrice',
        render: (b: SupplierBid) =>
          // Always render two lines so row height stays consistent
          // regardless of whether the local-currency conversion is shown
          // or the price is masked behind asterisks. The placeholder
          // non-breaking space reserves the second line's height.
          priceBlind ? (
            <Box>
              <Box>{b.pricePerPack}</Box>
              <Box sx={{ color: 'text.secondary', fontSize: 11 }}>
                {b.priceLocal ? `(${b.priceLocal})` : ' '}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ color: 'text.disabled', letterSpacing: 1 }}>****</Box>
              <Box sx={{ color: 'text.secondary', fontSize: 11 }}>{' '}</Box>
            </Box>
          ),
      },
    ],
    [t, priceBlind, theme.palette.text.primary, theme.palette.text.secondary],
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

  // Tender-level progress: counts items the user has walked past in this
  // session, so the bar advances each time they move on to the next item.
  // The current item itself only counts as evaluated once the user
  // navigates past it (i.e. clicks Next on the last bid).
  const evaluatedCount = Math.max(0, index - 1);
  const evaluatedRatio = total === 0 ? 0 : evaluatedCount / total;
  // The current item is "complete" once every visible bid has been moved
  // off the Not Evaluated default — drives the brand-colored "Evaluated"
  // chip next to the item code.
  const itemComplete =
    bids.length > 0 &&
    bids.every((_b, i) => (statusOverrides[i] ?? 'Not Evaluated') !== 'Not Evaluated');

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
          // Strip MUI's auto-applied elevation overlay so the dialog
          // doesn't render lighter than the rest of the app in dark
          // mode — Paper at elevation > 0 paints a white-tinted
          // backgroundImage on top of the bgcolor.
          elevation: 0,
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.default',
            backgroundImage: 'none',
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
            whiteSpace: 'nowrap',
          }}
        >
          {tenderTitle}
        </Typography>
        {/* Item-completion progress replaces the "Evaluate Item N/M" copy
            in the header — the visual bar conveys both the current item's
            progress and acts as the "how far through" indicator. */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2, minWidth: 240, flexShrink: 0 }}>
          <LinearProgress
            variant="determinate"
            value={evaluatedRatio * 100}
            sx={(theme) => ({
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(
                theme.palette.text.primary,
                theme.palette.mode === 'dark' ? 0.18 : 0.08,
              ),
              '& .MuiLinearProgress-bar': {
                bgcolor:
                  evaluatedRatio === 1
                    ? theme.palette.mode === 'dark'
                      ? '#4ED9A0'
                      : '#05813E'
                    : 'primary.main',
                borderRadius: 3,
              },
            })}
          />
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {evaluatedCount}/{total} Items Evaluated
          </Typography>
        </Box>
        {/* A/B-testing toggle — keeps version A (the current layout)
            available alongside an alternate version B so design
            variations can be compared side-by-side. */}
        <ToggleButtonGroup
          exclusive
          value={version}
          onChange={(_, v) => v && setVersion(v)}
          size="small"
          sx={{
            ml: 'auto',
            mr: 2,
            '& .MuiToggleButton-root': {
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              px: 2,
              py: 0,
              height: 20,
              minWidth: 36,
              borderColor: 'divider',
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.main', filter: 'brightness(1.1)' },
              },
            },
          }}
        >
          <ToggleButton value="A">A</ToggleButton>
          <ToggleButton value="B">B</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel
          control={
            <Switch
              checked={showAllComments}
              onChange={(e) => setShowAllComments(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.secondary' }}>
              {t('evaluateItemDialog.showAllComments')}
            </Typography>
          }
          sx={{ mr: 2 }}
        />
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

      {/* Body — original layout, now exposed under Version B. */}
      {version === 'B' && (
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: '10px', sm: 5 }, pb: 3 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              {/* Item is "complete" once every supplier bid on it has
                  been moved off the default Not Evaluated state. The chip
                  uses the brand primary color to match other "done"
                  affordances in the app. */}
              {itemComplete && (
                <Chip
                  label="Evaluated"
                  size="small"
                  sx={(theme) => ({
                    // 6% brand-tinted fill keeps the chip subtle while the
                    // 100% brand-color label still reads as the "this is
                    // done" signal.
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    color: 'primary.main',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 11,
                    height: 20,
                    borderRadius: '100px',
                    '& .MuiChip-label': { px: 1 },
                  })}
                />
              )}
            </Box>
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
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                {/* Comment column moved to the start of the row so the
                    chat icon sits on the left edge. No header label. */}
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', width: 36, px: 0 }} />
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
                      px: '10px',
                      whiteSpace: 'pre-line',
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
                const statusStyle = statusColors[status];
                const isExpanded = showAllComments || expandedComments.has(i);
                const hasCommentText = (comments[i] ?? '').trim().length > 0;
                // Icon turns blue only when the user has actually saved
                // comment text — an empty expanded field stays grey.
                const isActive = hasCommentText;
                const toggleComment = () =>
                  setExpandedComments((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  });
                return (
                  <Fragment key={i}>
                  <TableRow
                    sx={{
                      // Blue tint is only used as a rollover; an
                      // expanded row with no saved comment keeps the
                      // default cell fill.
                      '&:hover': { bgcolor: 'rgba(62,123,250,0.04)' },
                      // Collapse the bottom border when the comment row
                      // is showing so the two render as one continuous
                      // visual row.
                      ...(isExpanded && {
                        '& > td': { borderBottom: 'none' },
                      }),
                    }}
                  >
                    <TableCell sx={{ ...cellSx, width: 36, px: 0 }}>
                      <IconButton
                        size="small"
                        onClick={toggleComment}
                        aria-label="Toggle comment"
                        aria-expanded={isExpanded}
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
                          icon={<RoundedCheckboxIcon />}
                          checkedIcon={<RoundedCheckboxCheckedIcon />}
                          checked={status === 'Accept' || status === 'Preferred'}
                          onClick={() =>
                            setStatusOverrides((prev) => ({
                              ...prev,
                              [i]:
                                status === 'Accept' || status === 'Preferred'
                                  ? 'Not Evaluated'
                                  : 'Accept',
                            }))
                          }
                          sx={{
                            p: 0.5,
                            color: statusColors.Accept.color,
                            '&.Mui-checked': {
                              color: statusColors.Accept.color,
                            },
                          }}
                        />
                        <Checkbox
                          size="small"
                          aria-label={t('evaluateItemDialog.reject')}
                          icon={<RoundedCheckboxIcon />}
                          checkedIcon={<RoundedCheckboxCheckedIcon />}
                          checked={status === 'Disqualify'}
                          onClick={() =>
                            setStatusOverrides((prev) => ({
                              ...prev,
                              [i]: status === 'Disqualify' ? 'Not Evaluated' : 'Disqualify',
                            }))
                          }
                          sx={{
                            p: 0.5,
                            color: statusColors.Disqualify.color,
                            '&.Mui-checked': {
                              color: statusColors.Disqualify.color,
                            },
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
                  {isExpanded && (
                    <TableRow>
                      <TableCell />
                      <TableCell
                        colSpan={visibleColumns.length + 2}
                        sx={{ pt: 0, pb: '12px', px: '10px' }}
                      >
                        <InputBase
                          autoFocus
                          fullWidth
                          multiline
                          minRows={2}
                          placeholder={t('tenderSource.commentPlaceholder')}
                          value={comments[i] ?? ''}
                          onChange={(e) =>
                            setComments((prev) => ({ ...prev, [i]: e.target.value }))
                          }
                          sx={(theme) => ({
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.06)
                                : alpha(theme.palette.common.black, 0.04),
                            borderRadius: '8px',
                            px: 1.5,
                            py: 1,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 13,
                            color: 'text.primary',
                          })}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      )}

      {/* Body — combo-button variant, now exposed as the default
          Version A. */}
      {version === 'A' && (
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: '10px', sm: 5 }, pb: 3 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                {itemComplete && (
                  <Chip
                    label="Evaluated"
                    size="small"
                    sx={(theme) => ({
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      color: 'primary.main',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 11,
                      height: 20,
                      borderRadius: '100px',
                      '& .MuiChip-label': { px: 1 },
                    })}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 20,
                  color: 'text.primary',
                  lineHeight: 1.3,
                }}
              >
                {item.itemName}
              </Typography>
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

          {/* Suppliers table — clone of Version A. Iterate this block
              independently to test variations against A. */}
          <TableContainer>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', width: 36, px: 0 }} />
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
                        px: '10px',
                        whiteSpace: 'pre-line',
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
                  <TableCell
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      // Pin the status column to the right edge so it
                      // stays in view while the user scrolls through
                      // wide bid data.
                      position: 'sticky',
                      right: 0,
                      bgcolor: 'background.default',
                      textAlign: 'right',
                      zIndex: 1,
                    }}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBids.map((bid, i) => {
                  const status = statusOverrides[i] ?? 'Not Evaluated';
                  const statusStyle = statusColors[status];
                  const isExpanded = showAllComments || expandedComments.has(i);
                  const hasCommentText = (comments[i] ?? '').trim().length > 0;
                  const isActive = hasCommentText;
                  const toggleComment = () =>
                    setExpandedComments((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    });
                  return (
                    <Fragment key={i}>
                      <TableRow
                        sx={{
                          '&:hover': { bgcolor: 'rgba(62,123,250,0.04)' },
                          ...(isExpanded && {
                            '& > td': { borderBottom: 'none' },
                          }),
                        }}
                      >
                        <TableCell sx={{ ...cellSx, width: 36, px: 0 }}>
                          <IconButton
                            size="small"
                            onClick={toggleComment}
                            aria-label="Toggle comment"
                            aria-expanded={isExpanded}
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
                        <TableCell
                          sx={{
                            ...cellSx,
                            py: '8px',
                            pr: 0,
                            position: 'sticky',
                            right: 0,
                            bgcolor: 'background.default',
                            textAlign: 'right',
                            zIndex: 1,
                          }}
                        >
                          {isMobile ? (
                            // On narrow viewports the segmented combo is
                            // too wide for a sticky cell, so fall back to
                            // the same chip+menu dropdown Variant B uses.
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
                                '& .MuiChip-label': { px: 1 },
                                '& .MuiChip-deleteIcon': {
                                  color: statusStyle.color,
                                  '&:hover': { color: statusStyle.color, opacity: 0.8 },
                                },
                                '&:hover': { bgcolor: statusStyle.bg, filter: 'brightness(0.95)' },
                              }}
                            />
                          ) : (
                            <ToggleButtonGroup
                              exclusive
                              value={status}
                              onChange={(_, v) => {
                                if (!v) return;
                                setStatusOverrides((prev) => {
                                  const next = { ...prev, [i]: v as BidStatus };
                                  // Preferred is exclusive across the
                                  // table — promote any other Preferred
                                  // bid to Accept so only this row keeps
                                  // the Preferred status.
                                  if (v === 'Preferred') {
                                    Object.keys(next).forEach((k) => {
                                      const idx = Number(k);
                                      if (idx !== i && next[idx] === 'Preferred') {
                                        next[idx] = 'Accept';
                                      }
                                    });
                                  }
                                  return next;
                                });
                              }}
                              size="small"
                              sx={{
                                borderRadius: '6px',
                                '& .MuiToggleButton-root': {
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: 11,
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  px: 1.25,
                                  py: 0,
                                  height: 24,
                                  lineHeight: 1.2,
                                  borderColor: 'divider',
                                },
                              }}
                            >
                              {STATUS_OPTIONS.filter((opt) => opt !== 'Not Evaluated').map((opt) => {
                                const optStyle = statusColors[opt];
                                return (
                                  <ToggleButton
                                    key={opt}
                                    value={opt}
                                    sx={{
                                      color: optStyle.color,
                                      '&:hover': {
                                        bgcolor: optStyle.bg,
                                        color: optStyle.color,
                                      },
                                      '&.Mui-selected': {
                                        bgcolor: optStyle.bg,
                                        color: optStyle.color,
                                        '&:hover': { bgcolor: optStyle.bg, filter: 'brightness(0.95)' },
                                      },
                                    }}
                                  >
                                    {opt}
                                  </ToggleButton>
                                );
                              })}
                            </ToggleButtonGroup>
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell />
                          <TableCell
                            colSpan={visibleColumns.length + 1}
                            sx={{ pt: 0, pb: '12px', px: '10px' }}
                          >
                            <InputBase
                              autoFocus
                              fullWidth
                              multiline
                              minRows={2}
                              placeholder={t('tenderSource.commentPlaceholder')}
                              value={comments[i] ?? ''}
                              onChange={(e) =>
                                setComments((prev) => ({ ...prev, [i]: e.target.value }))
                              }
                              sx={(theme) => ({
                                bgcolor:
                                  theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.common.white, 0.06)
                                    : alpha(theme.palette.common.black, 0.04),
                                borderRadius: '8px',
                                px: 1.5,
                                py: 1,
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 13,
                                color: 'text.primary',
                              })}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

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
          const optStyle = statusColors[opt];
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
          sx={primaryNavBtnSx}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </IconButton>

        <Button
          variant="contained"
          onClick={onNext}
          sx={(theme) => {
            const isDark = theme.palette.mode === 'dark';
            return {
              bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.06),
              color: 'primary.main',
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
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.28 : 0.12),
                boxShadow: 'none',
              },
            };
          }}
        >
          {t('evaluateItemDialog.next')}
        </Button>

        <IconButton
          onClick={onNext}
          disabled={index >= total}
          aria-label={t('evaluateItemDialog.nextItem')}
          sx={primaryNavBtnSx}
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
  py: '10px',
  px: '10px',
  whiteSpace: 'nowrap',
};


// Brand-tinted variant matching the central "NEXT" CTA — alpha bumps
// up in dark mode so the chevron sits on a visible brand-tinted halo
// rather than disappearing into the dark surface.
const primaryNavBtnSx = (theme: import('@mui/material/styles').Theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: 40,
    height: 40,
    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.06),
    color: 'primary.main',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.28 : 0.12),
      color: 'primary.main',
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.04),
      color: alpha(theme.palette.primary.main, 0.4),
    },
  };
};
