import {
  ArrowDown01Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  NoteIcon,
  PrinterIcon,
  Task01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLayout } from '../components/nav-layout';
import type { NavItem } from '../components/nav-layout';
import DateInput from '../components/tender/DateInput';
import DocumentDropZone from '../components/tender/DocumentDropZone';
import DocumentList from '../components/tender/DocumentList';
import type { TenderDocument } from '../components/tender/DocumentList';
import type { TenderRow } from './TendersView';

/** Format a Date as DD.MM.YYYY for the document upload date column. */
function formatUploadDate(d: Date = new Date()): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/** Static serial used for tenders created through this form. The real
 *  app would assign a unique serial once the tender is persisted. */
const NEW_TENDER_SERIAL = 'TN-0000';

/** Format today's date as `D/M/YYYY` to match TenderRow's stored format. */
function todayDmy(): string {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

/** Convert a `<input type="date">` ISO string into the `D/M/YYYY` format
 *  the rest of the app stores. */
function fromIsoDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${parseInt(d, 10)}/${parseInt(mo, 10)}/${y}`;
}

const inputSx = {
  bgcolor: 'action.hover',
  borderRadius: '8px',
  px: 1.5,
  py: 0.75,
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: 'text.primary',
  height: 36,
};

const inputErrorSx = {
  ...inputSx,
  outline: '2px solid',
  outlineColor: 'error.main',
};

/** Variant of {@link inputSx} for `<input type="date">` that mutes the
 *  native "dd/mm/yyyy" placeholder text when no value is selected. */
const dateInputSx = (value: string, error = false) => ({
  ...(error ? inputErrorSx : inputSx),
  color: value ? 'text.primary' : 'text.disabled',
});

const selectSx = {
  ...inputSx,
  // Match the left edge of text/date inputs by zeroing the inner padding
  // (the wrapper's `inputSx.px` already provides the 12px gutter). MUI's
  // default right padding stays in place to leave room for the chevron.
  '& .MuiSelect-select': { py: 0.75, paddingLeft: 0 },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid #3E7BFA' },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      '& .MuiMenuItem-root': {
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
      },
    },
  },
};

const labelSx = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 14,
  color: 'text.primary',
  minWidth: 120,
  whiteSpace: 'nowrap' as const,
};

interface FormRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormRow({ label, required, children, fullWidth }: FormRowProps) {
  return (
    // `minWidth: 0` overrides the default `min-width: auto` on flex items so
    // the FormRow can actually shrink to its 45% basis. Without it, fields
    // with wider intrinsic min-content (e.g. the MUI X DatePicker) prevent
    // two FormRows from sitting side-by-side.
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: fullWidth ? '1 1 100%' : '1 1 45%' }}>
      <Typography sx={labelSx}>
        {label}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

interface TenderNewViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  /** Append the freshly-created tender to App's tenders list. */
  onCreate: (next: TenderRow) => void;
  logoUrl?: string;
}

export default function TenderNewView({ navItems, onNavigate, onCreate, logoUrl }: TenderNewViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  // Form state — all fields start blank except the static serial.
  const [reference, setReference] = useState('');
  const [incoterm, setIncoterm] = useState('');
  const [description, setDescription] = useState('');
  const [process, setProcess] = useState('RFQ');
  const [type, setType] = useState('Supplies');
  const [workflow, setWorkflow] = useState('Standard');
  const [category, setCategory] = useState('');
  const [advertised, setAdvertised] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tenderPeriod, setTenderPeriod] = useState('2 years');
  const [expires, setExpires] = useState('');
  const [notes, setNotes] = useState('');
  // Errors only surface after the user attempts a save so empty initial
  // fields don't render in red.
  const [showErrors, setShowErrors] = useState(false);

  // Document state — both lists start empty for a new tender.
  const [internalOpen, setInternalOpen] = useState(true);
  const [procurementOpen, setProcurementOpen] = useState(true);
  const [internalDocs, setInternalDocs] = useState<TenderDocument[]>([]);
  const [procurementDocs, setProcurementDocs] = useState<TenderDocument[]>([]);

  const handleAddInternalDocs = (files: File[]) => {
    const next = files.map((f, i) => ({
      id: `new-int-${Date.now()}-${i}`,
      name: f.name,
      uploadDate: formatUploadDate(),
    }));
    setInternalDocs((prev) => [...prev, ...next]);
  };

  const handleAddProcurementDocs = (files: File[]) => {
    const next = files.map((f, i) => ({
      id: `new-proc-${Date.now()}-${i}`,
      name: f.name,
      uploadDate: formatUploadDate(),
    }));
    setProcurementDocs((prev) => [...prev, ...next]);
  };

  const descError = showErrors && !description.trim();
  const deadlineError = showErrors && !deadline;

  const handleSave = () => {
    setShowErrors(true);
    if (!description.trim() || !deadline) return;
    onCreate({
      serial: NEW_TENDER_SERIAL,
      status: 'Planning',
      method: process,
      type,
      description: description.trim(),
      reference: reference.trim(),
      created: todayDmy(),
      advertised: advertised ? fromIsoDate(advertised) : '',
      deadline: fromIsoDate(deadline),
      expires: expires ? fromIsoDate(expires) : '',
      incoterm: incoterm || undefined,
      workflow: workflow || undefined,
      category: category.trim() || undefined,
      tenderPeriod: tenderPeriod || undefined,
      notes: notes.trim() || undefined,
    });
    onNavigate('/tenders');
  };

  return (
    <NavLayout
      navItems={navItems}
      activePath="/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: t('tenderNew.title'),
        onBack: () => onNavigate('/tenders'),
        comboActions: [
          { icon: <HugeiconsIcon icon={PrinterIcon} size={20} />, label: t('common.print'), onClick: () => {} },
          { icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />, label: t('common.help'), onClick: () => {} },
        ],
      }}
      footerProps={{
        storeName: 'Central HQ',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2, pb: 4 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '10px', mb: 2, overflow: 'hidden' }}>
          {/* Section header — always expanded on the create form. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2 }}>
            <HugeiconsIcon icon={InformationCircleIcon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.tenderDetails')}
            </Typography>
          </Box>

          <Box sx={{ px: 3, pb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Row 1: Serial Number (static) */}
            <FormRow label={t('tenderPlan.serialNumber')} fullWidth>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary' }}>
                {NEW_TENDER_SERIAL}
              </Typography>
            </FormRow>

            {/* Row 2: Reference + Incoterm */}
            <FormRow label={t('tenderPlan.reference')}>
              <InputBase
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                sx={inputSx}
                fullWidth
              />
            </FormRow>
            <FormRow label={t('tenderPlan.incoterm')}>
              <Select
                size="small"
                displayEmpty
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                fullWidth
                sx={selectSx}
                MenuProps={selectMenuProps}
                IconComponent={() => (
                  <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                  </Box>
                )}
              >
                <MenuItem value=""><em></em></MenuItem>
                <MenuItem value="DAP">DAP</MenuItem>
                <MenuItem value="CIF">CIF</MenuItem>
                <MenuItem value="FOB">FOB</MenuItem>
              </Select>
            </FormRow>

            {/* Row 3: Description (required) */}
            <FormRow label={t('tenderPlan.description')} required fullWidth>
              <InputBase
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={descError ? inputErrorSx : inputSx}
                fullWidth
              />
            </FormRow>

            {/* Row 4: Process + Type */}
            <FormRow label={t('tenderPlan.process')}>
              <Select
                size="small"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                fullWidth
                sx={selectSx}
                MenuProps={selectMenuProps}
                IconComponent={() => (
                  <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                  </Box>
                )}
              >
                <MenuItem value="RFQ">RFQ</MenuItem>
                <MenuItem value="RFT">RFT</MenuItem>
              </Select>
            </FormRow>
            <FormRow label={t('tenderPlan.type')}>
              <Select
                size="small"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                sx={selectSx}
                MenuProps={selectMenuProps}
                IconComponent={() => (
                  <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                  </Box>
                )}
              >
                <MenuItem value="Supplies">Supplies</MenuItem>
                <MenuItem value="Consumables">Consumables</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
              </Select>
            </FormRow>

            {/* Row 5: Workflow + Category */}
            <FormRow label={t('tenderPlan.workflow')}>
              <Select
                size="small"
                displayEmpty
                value={workflow}
                onChange={(e) => setWorkflow(e.target.value)}
                fullWidth
                sx={selectSx}
                MenuProps={selectMenuProps}
                IconComponent={() => (
                  <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                  </Box>
                )}
              >
                <MenuItem value=""><em></em></MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormRow>
            <FormRow label={t('tenderPlan.category')}>
              <InputBase
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={inputSx}
                fullWidth
              />
            </FormRow>

            {/* Row 6: Advertise Date + Deadline (required) */}
            <FormRow label={t('tenderPlan.advertiseDate')}>
              <DateInput
                value={advertised}
                onChange={setAdvertised}
                sx={dateInputSx(advertised)}
              />
            </FormRow>
            <FormRow label={t('tenderPlan.deadline')} required>
              <DateInput
                value={deadline}
                onChange={setDeadline}
                sx={dateInputSx(deadline, deadlineError)}
              />
            </FormRow>

            {/* Row 7: Tender Period + Tender Expiry */}
            <FormRow label={t('tenderPlan.tenderPeriod')}>
              <Select
                size="small"
                displayEmpty
                value={tenderPeriod}
                onChange={(e) => setTenderPeriod(e.target.value)}
                fullWidth
                sx={selectSx}
                MenuProps={selectMenuProps}
                IconComponent={() => (
                  <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                  </Box>
                )}
              >
                <MenuItem value=""><em></em></MenuItem>
                <MenuItem value="1 year">1 year</MenuItem>
                <MenuItem value="2 years">2 years</MenuItem>
                <MenuItem value="3 years">3 years</MenuItem>
                <MenuItem value="Indefinite">Indefinite</MenuItem>
              </Select>
            </FormRow>
            <FormRow label={t('tenderPlan.tenderExpiry')}>
              <DateInput
                value={expires}
                onChange={setExpires}
                sx={dateInputSx(expires)}
              />
            </FormRow>

            {/* Row 8: Notes */}
            <FormRow label={t('tenderPlan.notes')} fullWidth>
              <InputBase
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ ...inputSx, height: 'auto', alignItems: 'flex-start', py: 1.5 }}
                fullWidth
              />
            </FormRow>
          </Box>
        </Box>

        {/* Internal Documents — staged here on the create form, attached to
            the new tender once the create flow is fully wired through. */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '10px', mb: 2, overflow: 'hidden' }}>
          <Box
            onClick={() => setInternalOpen(!internalOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 2,
              cursor: 'pointer',
              // Hovering anywhere on the header previews the chevron's own
              // hover state so the whole row reads as one click target.
              '&:hover .MuiIconButton-root': {
                color: '#3E7BFA',
                bgcolor: 'rgba(62,123,250,0.08)',
              },
            }}
          >
            <HugeiconsIcon icon={Task01Icon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.internalDocuments')}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: internalOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s, color 0.15s, background-color 0.15s',
                '&:hover': { color: '#3E7BFA', bgcolor: 'rgba(62,123,250,0.08)' },
              }}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </IconButton>
          </Box>
          <Collapse in={internalOpen}>
            <Box sx={{ px: 3, pb: 3 }}>
              <DocumentDropZone onFilesAdded={handleAddInternalDocs} />
              <Box sx={{ mt: 2 }}>
                <DocumentList
                  documents={internalDocs}
                  onRemove={(id) => setInternalDocs((prev) => prev.filter((d) => d.id !== id))}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Procurement Documents */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '10px', mb: 3, overflow: 'hidden' }}>
          <Box
            onClick={() => setProcurementOpen(!procurementOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 2,
              cursor: 'pointer',
              // Hovering anywhere on the header previews the chevron's own
              // hover state so the whole row reads as one click target.
              '&:hover .MuiIconButton-root': {
                color: '#3E7BFA',
                bgcolor: 'rgba(62,123,250,0.08)',
              },
            }}
          >
            <HugeiconsIcon icon={NoteIcon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.procurementDocuments')}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: procurementOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s, color 0.15s, background-color 0.15s',
                '&:hover': { color: '#3E7BFA', bgcolor: 'rgba(62,123,250,0.08)' },
              }}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </IconButton>
          </Box>
          <Collapse in={procurementOpen}>
            <Box sx={{ px: 3, pb: 3 }}>
              <DocumentDropZone onFilesAdded={handleAddProcurementDocs} />
              <Box sx={{ mt: 2 }}>
                <DocumentList
                  documents={procurementDocs}
                  onRemove={(id) => setProcurementDocs((prev) => prev.filter((d) => d.id !== id))}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {(descError || deadlineError) && (
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'error.main', mb: 1, textAlign: 'right' }}>
            {t('tenderNew.requiredFields')}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: '60px' }}>
          <Button
            variant="text"
            onClick={() => onNavigate('/tenders')}
            sx={{
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {t('tenderNew.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!description.trim() || !deadline}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '24px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': { bgcolor: primaryColor, boxShadow: '0px 2px 8px rgba(0,0,0,0.15)', filter: 'brightness(1.1)' },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            {t('tenderNew.save')}
          </Button>
        </Box>
      </Box>
    </NavLayout>
  );
}
