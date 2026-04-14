import {
  AddCircleIcon,
  ArrowDown01Icon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  InformationSquareIcon,
  Package01Icon,
  SaleTag02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#F2F2F5',
    borderRadius: '8px',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
  },
  '& .MuiOutlinedInput-input': { py: '9px', px: '12px', fontSize: 14, color: '#1C1C28' },
};

const activeInputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#E8F1FE',
    borderRadius: '8px',
    '& fieldset': { borderColor: '#3E7BFA', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#3E7BFA' },
    '&.Mui-focused fieldset': { borderColor: '#3E7BFA', borderWidth: 1 },
  },
  '& .MuiOutlinedInput-input': { py: '9px', px: '12px', fontSize: 14, color: '#1C1C28' },
};

const selectSx = {
  bgcolor: '#F2F2F5',
  borderRadius: '8px',
  fontSize: 14,
  color: '#1C1C28',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '.MuiSelect-select': { py: '9px', px: '12px' },
};

const labelSx = {
  fontSize: 14,
  fontWeight: 500,
  color: '#1C1C28',
  mb: 0.75,
  fontFamily: 'Inter, sans-serif',
};

const ICON_COL_WIDTH = 36; // icon 24px + gap 12px

interface AddItemsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddItemsModal({ open, onClose }: AddItemsModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 800,
          maxWidth: '95vw',
          borderRadius: '20px',
          boxShadow: '0px 0px 2px rgba(0,0,0,0.04), 0px 4px 8px rgba(0,0,0,0.32)',
        },
      }}
    >
      <DialogContent sx={{ p: 3.5 }}>

        {/* Top row: title + Add Batch button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#1C1C28', fontFamily: 'Inter, sans-serif' }}>
            Add Items
          </Typography>
          <Button
            startIcon={<HugeiconsIcon icon={AddCircleIcon} size={20} color="#E95C30" />}
            sx={{
              bgcolor: 'white',
              color: '#1C1C28',
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              px: 2.5,
              height: 40,
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '&:hover': { bgcolor: 'rgba(233,92,48,0.05)' },
            }}
          >
            Add Batch
          </Button>
        </Box>

        {/* Item info card */}
        <Box sx={{ bgcolor: '#F2F2F5', borderRadius: '16px', px: 3, py: 2, mb: 2 }}>
          <Typography sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}>
            030062, tablet
          </Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#1C1C28', fontFamily: 'Inter, sans-serif', lineHeight: '26px' }}>
            Acetylsalicylic Acid 300mg tabs
          </Typography>
        </Box>

        {/* Batch drawer card */}
        <Box sx={{ border: '4px solid #F2F2F5', borderRadius: '16px', px: 2.5, pt: 2, pb: 1.5, mb: 3 }}>

          {/* Batch header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1C1C28', fontFamily: 'Inter, sans-serif' }}>
              Batch ABC1234
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif' }}>
                20 Packs Received
              </Typography>
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} color="#555770" />
            </Box>
          </Box>

          {/* Row group 1: Package icon — Batch / Expiry / Shipped Pack Size / Packs Shipped + Packs Received / Vials / Volume */}
          <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 2 }}>
            <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
              <HugeiconsIcon icon={Package01Icon} size={24} />
            </Box>
            <Box>
              {/* Row 1a: 4 equal columns */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 2 }}>
                <Box>
                  <Typography sx={labelSx}>Batch</Typography>
                  <TextField fullWidth size="small" defaultValue="ABC1234" sx={activeInputSx} />
                </Box>
                <Box>
                  <Typography sx={labelSx}>Expiry Date</Typography>
                  <TextField
                    fullWidth size="small" sx={inputSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <HugeiconsIcon icon={Calendar01Icon} size={14} color="#555770" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={labelSx}>Shipped Pack Size</Typography>
                  <TextField fullWidth size="small" sx={inputSx} />
                </Box>
                <Box>
                  <Typography sx={labelSx}>Packs Shipped</Typography>
                  <TextField fullWidth size="small" sx={inputSx} />
                </Box>
              </Box>
              {/* Row 1b: 3 items aligned to 4-col grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
                <Box>
                  <Typography sx={labelSx}>Packs Received</Typography>
                  <TextField fullWidth size="small" sx={inputSx} />
                </Box>
                <Box>
                  <Typography sx={labelSx}>Vials Received</Typography>
                  <TextField fullWidth size="small" sx={inputSx} />
                </Box>
                <Box>
                  <Typography sx={labelSx}>
                    Volume per Pack (m<sup>3</sup>)
                  </Typography>
                  <TextField fullWidth size="small" sx={inputSx} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Row group 2: Price icon */}
          <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 2 }}>
            <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
              <HugeiconsIcon icon={SaleTag02Icon} size={24} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 1.5 }}>
              <Box>
                <Typography sx={labelSx}>Pack Cost Price</Typography>
                <TextField
                  fullWidth size="small" sx={inputSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 14, color: '#555770' }}>$</Typography></InputAdornment>,
                  }}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>Pack Sell Price</Typography>
                <TextField
                  fullWidth size="small" sx={inputSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 14, color: '#555770' }}>$</Typography></InputAdornment>,
                  }}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>Line Total</Typography>
                <TextField
                  fullWidth size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiOutlinedInput-input': { py: '9px', px: '12px', fontSize: 14, color: '#1C1C28' },
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 14, color: '#555770' }}>$</Typography></InputAdornment>,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Row group 3: Info icon */}
          <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 1 }}>
            <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
              <HugeiconsIcon icon={InformationSquareIcon} size={24} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 1.5 }}>
              <Box>
                <Typography sx={labelSx}>Location</Typography>
                <Select
                  fullWidth size="small" displayEmpty value="" sx={selectSx}
                  IconComponent={() => (
                    <Box sx={{ pr: 1, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="#555770" />
                    </Box>
                  )}
                >
                  <MenuItem value=""></MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography sx={labelSx}>Campaign / Program</Typography>
                <Select
                  fullWidth size="small" displayEmpty value="" sx={selectSx}
                  IconComponent={() => (
                    <Box sx={{ pr: 1, display: 'flex', alignItems: 'center' }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="#555770" />
                    </Box>
                  )}
                >
                  <MenuItem value=""></MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography sx={labelSx}>Comment</Typography>
                <TextField fullWidth size="small" sx={inputSx} />
              </Box>
            </Box>
          </Box>

          {/* Delete Batch */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, gap: 0.75, alignItems: 'center', cursor: 'pointer' }}>
            <HugeiconsIcon icon={Delete02Icon} size={16} color="#E53535" />
            <Typography sx={{ fontSize: 14, color: '#E53535', fontFamily: 'Inter, sans-serif' }}>
              Delete Batch
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
          <Button
            onClick={onClose}
            startIcon={<HugeiconsIcon icon={CancelCircleIcon} size={20} color="#3E7BFA" />}
            sx={{
              bgcolor: 'white',
              color: '#3E7BFA',
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              px: 2.5,
              height: 36,
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '&:hover': { bgcolor: 'rgba(62,123,250,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            startIcon={<HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="white" />}
            onClick={onClose}
            sx={{
              bgcolor: '#3E7BFA',
              color: 'white',
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              px: 2.5,
              height: 36,
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '&:hover': { bgcolor: '#2d6ae0' },
            }}
          >
            Ok
          </Button>
          <Button
            onClick={onClose}
            startIcon={<HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="white" />}
            sx={{
              bgcolor: '#3E7BFA',
              color: 'white',
              borderRadius: 24,
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              px: 2.5,
              height: 36,
              boxShadow: '0px 0px 2px rgba(40,41,61,0.04), 0px 4px 8px rgba(96,97,112,0.16)',
              '&:hover': { bgcolor: '#2d6ae0' },
            }}
          >
            Ok &amp; Next Item
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
}
