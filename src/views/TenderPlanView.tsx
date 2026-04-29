import {
  ArrowDown01Icon,
  Calendar03Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  NoteIcon,
  PrinterIcon,
  Task01Icon,
  TaskEdit01Icon,
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
import EmptyStateView from '../components/EmptyStateView';
import { getTenderSteps } from '../components/tender/tender.types';
import type { NavItem } from '../components/nav-layout';
import DocumentDropZone from '../components/tender/DocumentDropZone';
import DocumentList from '../components/tender/DocumentList';
import type { TenderDocument } from '../components/tender/DocumentList';
import StatusController from '../components/tender/StatusController';
import type { TenderRow } from './TendersView';

interface TenderPlanViewProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  tender: TenderRow;
  logoUrl?: string;
}

function randomDate(): string {
  const day = Math.floor(Math.random() * 28) + 1;
  const month = Math.floor(Math.random() * 3) + 1;
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2025`;
}

const INITIAL_INTERNAL_DOCS: TenderDocument[] = [
  { id: '1', name: 'Budget Allocation.xlsx', uploadDate: randomDate() },
  { id: '2', name: 'Business Case.docx', uploadDate: randomDate() },
  { id: '3', name: 'Confidentiality Agreements.pdf', uploadDate: randomDate() },
  { id: '4', name: 'Evaluation Criteria.docx', uploadDate: randomDate() },
  { id: '5', name: 'Procurement Plan.pdf', uploadDate: randomDate() },
  { id: '6', name: 'Risk Register.xlsx', uploadDate: randomDate() },
];

const INITIAL_PROCUREMENT_DOCS: TenderDocument[] = [
  { id: '7', name: 'RFx document.pdf', uploadDate: randomDate() },
  { id: '8', name: 'Supplier Guidance Document.pdf', uploadDate: randomDate() },
  { id: '9', name: 'Terms and Conditions.pdf', uploadDate: randomDate() },
];

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

const selectSx = {
  ...inputSx,
  '& .MuiSelect-select': { py: 0.75, px: 1.5 },
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
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormRow({ label, children, fullWidth }: FormRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: fullWidth ? '1 1 100%' : '1 1 45%' }}>
      <Typography sx={labelSx}>{label}</Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

export default function TenderPlanView({ navItems, onNavigate, tender, logoUrl }: TenderPlanViewProps) {
  const { t } = useTranslation();
  const stepStatus = getTenderSteps(tender.status).find((s) => s.key === 'plan')?.status;
  const showEmpty = stepStatus === 'incomplete';
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  const [detailsOpen, setDetailsOpen] = useState(true);
  const [internalOpen, setInternalOpen] = useState(true);
  const [procurementOpen, setProcurementOpen] = useState(true);

  const [internalDocs, setInternalDocs] = useState<TenderDocument[]>(INITIAL_INTERNAL_DOCS);
  const [procurementDocs, setProcurementDocs] = useState<TenderDocument[]>(INITIAL_PROCUREMENT_DOCS);

  const handleAddInternalDocs = (files: File[]) => {
    const newDocs = files.map((f, i) => ({
      id: `new-int-${Date.now()}-${i}`,
      // Keep the extension on the stored name so DocumentList can show the
      // correct file-type badge (PDF / DOCX / XLSX / etc).
      name: f.name,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    }));
    setInternalDocs((prev) => [...prev, ...newDocs]);
  };

  const handleAddProcurementDocs = (files: File[]) => {
    const newDocs = files.map((f, i) => ({
      id: `new-proc-${Date.now()}-${i}`,
      // Keep the extension on the stored name so DocumentList can show the
      // correct file-type badge (PDF / DOCX / XLSX / etc).
      name: f.name,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    }));
    setProcurementDocs((prev) => [...prev, ...newDocs]);
  };

  return (
    <NavLayout
      navItems={navItems}
      activePath="/replenishment/tenders"
      logoUrl={logoUrl}
      headerProps={{
        title: `${tender.serial} > ${tender.description}`,
        afterTitle: <StatusController activeStep="plan" onNavigate={onNavigate} />,
        onBack: () => onNavigate('/replenishment/tenders/detail'),
        comboActions: [
          { icon: <HugeiconsIcon icon={PrinterIcon} size={20} />, label: t('common.print'), onClick: () => {} },
          { icon: <HugeiconsIcon icon={HelpCircleIcon} size={20} />, label: t('common.help'), onClick: () => {} },
        ],
      }}
      footerProps={{
        storeName: 'Central Tamaki Warehouse',
        userName: 'Mark Prins',
        syncedAt: t('footer.syncedAgo', { time: '3 mins' }),
        isOnline: true,
      }}
    >
      {showEmpty ? (
        <EmptyStateView
          icon={TaskEdit01Icon}
          description={t('emptyState.planDescription')}
          actionLabel={t('emptyState.backToOverview')}
          onAction={() => onNavigate('/replenishment/tenders/detail')}
        />
      ) : (
        <>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2, pb: 4 }}>
        {/* Tender Details Section */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: '10px', mb: 2, overflow: 'hidden' }}>
          {/* Section Header */}
          <Box
            onClick={() => setDetailsOpen(!detailsOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <HugeiconsIcon icon={InformationCircleIcon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.tenderDetails')}
            </Typography>
            <IconButton size="small" sx={{ transform: detailsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </IconButton>
          </Box>

          <Collapse in={detailsOpen}>
            <Box sx={{ px: 3, pb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Row 1: Serial Number */}
              <FormRow label={t('tenderPlan.serialNumber')} fullWidth>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'text.primary' }}>
                  {tender.serial}
                </Typography>
              </FormRow>

              {/* Row 2: Reference + Incoterm */}
              <FormRow label={t('tenderPlan.reference')}>
                <InputBase value={tender.reference} readOnly sx={inputSx} fullWidth />
              </FormRow>
              <FormRow label={t('tenderPlan.incoterm')}>
                <Select size="small" displayEmpty value="" fullWidth sx={selectSx} MenuProps={selectMenuProps}
                  IconComponent={() => (
                    <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                    </Box>
                  )}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="DAP">DAP</MenuItem>
                  <MenuItem value="CIF">CIF</MenuItem>
                  <MenuItem value="FOB">FOB</MenuItem>
                </Select>
              </FormRow>

              {/* Row 3: Description */}
              <FormRow label={t('tenderPlan.description')} fullWidth>
                <InputBase value={tender.description} readOnly sx={inputSx} fullWidth />
              </FormRow>

              {/* Row 4: Process + Type */}
              <FormRow label={t('tenderPlan.process')}>
                <Select size="small" value={tender.method} fullWidth sx={selectSx} MenuProps={selectMenuProps}
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
                <Select size="small" value={tender.type} fullWidth sx={selectSx} MenuProps={selectMenuProps}
                  IconComponent={() => (
                    <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                    </Box>
                  )}
                >
                  <MenuItem value="Supplies">Supplies</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                  <MenuItem value="Works">Works</MenuItem>
                </Select>
              </FormRow>

              {/* Row 5: Workflow + Category */}
              <FormRow label={t('tenderPlan.workflow')}>
                <Select size="small" displayEmpty value="" fullWidth sx={selectSx} MenuProps={selectMenuProps}
                  IconComponent={() => (
                    <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                    </Box>
                  )}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Express">Express</MenuItem>
                </Select>
              </FormRow>
              <FormRow label={t('tenderPlan.category')}>
                <InputBase placeholder="" sx={inputSx} fullWidth />
              </FormRow>

              {/* Row 6: Advertise Date + Deadline */}
              <FormRow label={t('tenderPlan.advertiseDate')}>
                <InputBase
                  value={tender.advertised}
                  readOnly
                  sx={inputSx}
                  fullWidth
                  endAdornment={
                    <HugeiconsIcon icon={Calendar03Icon} size={14} color="currentColor" />
                  }
                />
              </FormRow>
              <FormRow label={t('tenderPlan.deadline')}>
                <InputBase
                  value={tender.deadline}
                  readOnly
                  sx={inputSx}
                  fullWidth
                  endAdornment={
                    <HugeiconsIcon icon={Calendar03Icon} size={14} color="currentColor" />
                  }
                />
              </FormRow>

              {/* Row 7: Tender Period + Tender Expiry */}
              <FormRow label={t('tenderPlan.tenderPeriod')}>
                <Select size="small" displayEmpty value="" fullWidth sx={selectSx} MenuProps={selectMenuProps}
                  IconComponent={() => (
                    <Box sx={{ pr: 0, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" />
                    </Box>
                  )}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                  <MenuItem value="2 years">2 years</MenuItem>
                  <MenuItem value="3 years">3 years</MenuItem>
                </Select>
              </FormRow>
              <FormRow label={t('tenderPlan.tenderExpiry')}>
                <InputBase
                  value={tender.expires}
                  readOnly
                  sx={inputSx}
                  fullWidth
                  endAdornment={
                    <HugeiconsIcon icon={Calendar03Icon} size={14} color="currentColor" />
                  }
                />
              </FormRow>

              {/* Row 8: Notes */}
              <FormRow label={t('tenderPlan.notes')} fullWidth>
                <InputBase
                  multiline
                  rows={3}
                  placeholder=""
                  sx={{
                    ...inputSx,
                    height: 'auto',
                    alignItems: 'flex-start',
                    py: 1.5,
                  }}
                  fullWidth
                />
              </FormRow>
            </Box>
          </Collapse>
        </Box>

        {/* Internal Documents Section */}
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
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <HugeiconsIcon icon={Task01Icon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.internalDocuments')}
            </Typography>
            <IconButton size="small" sx={{ transform: internalOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
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

        {/* Procurement Documents Section */}
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
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <HugeiconsIcon icon={NoteIcon} size={20} color={primaryColor} />
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, color: 'text.primary', flex: 1 }}>
              {t('tenderPlan.procurementDocuments')}
            </Typography>
            <IconButton size="small" sx={{ transform: procurementOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
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

        {/* Done Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => onNavigate('/replenishment/tenders/detail')}
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.46px',
              borderRadius: '24px',
              px: 4,
              py: 1,
              boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: primaryColor,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            {t('tenderPlan.done')}
          </Button>
        </Box>
      </Box>
        </>
      )}
    </NavLayout>
  );
}
