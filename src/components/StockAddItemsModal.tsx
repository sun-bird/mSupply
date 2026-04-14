import {
  Analytics01Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  InformationSquareIcon,
  Package01Icon,
  PackageProcessIcon,
  SaleTag02Icon,
  Settings04Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Box,
  Button,
  Checkbox,
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

const ICON_COL_WIDTH = 36;

interface StockAddItemsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StockAddItemsModal({ open, onClose }: StockAddItemsModalProps) {
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

        {/* Top row: title + Repack/Adjust buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#1C1C28', fontFamily: 'Inter, sans-serif' }}>
            Add Items
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              startIcon={<HugeiconsIcon icon={PackageProcessIcon} size={20} color="#E95C30" />}
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
              Repack
            </Button>
            <Button
              startIcon={<HugeiconsIcon icon={Settings04Icon} size={20} color="#E95C30" />}
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
              Adjust
            </Button>
          </Box>
        </Box>

        {/* Product card */}
        <Box sx={{ bgcolor: '#F2F2F5', borderRadius: '16px', px: 3, py: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 14, color: '#1C1C28', fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}>
              BCG, Vial
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#1C1C28', fontFamily: 'Inter, sans-serif', lineHeight: '26px' }}>
              BCG Vaccine
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1C28', fontFamily: 'Inter, sans-serif' }}>
              On Hold
            </Typography>
            <Checkbox
              size="small"
              sx={{
                p: 0.5,
                color: '#1C1C28',
                '&.Mui-checked': { color: '#3E7BFA' },
                '& .MuiSvgIcon-root': { fontSize: 18, borderRadius: '4px' },
              }}
            />
          </Box>
        </Box>

        {/* Row group 1: Package icon — Batch / Expiry Date / Pack Size / Volume per Pack */}
        <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 2 }}>
          <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
            <HugeiconsIcon icon={Package01Icon} size={24} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            <Box>
              <Typography sx={labelSx}>Batch</Typography>
              <TextField fullWidth size="small" defaultValue="BCG01" sx={activeInputSx} />
            </Box>
            <Box>
              <Typography sx={labelSx}>Expiry Date</Typography>
              <TextField
                fullWidth size="small" sx={inputSx}
                placeholder="DD/MM/YYYY"
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
              <Typography sx={labelSx}>Pack Size</Typography>
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

        {/* Row group 2: Chart icon — Pack Quantity / Available Packs / Available Stock / Stock on Hand */}
        <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 2 }}>
          <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
            <HugeiconsIcon icon={Analytics01Icon} size={24} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            <Box>
              <Typography sx={labelSx}>Pack Quantity</Typography>
              <TextField fullWidth size="small" sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={labelSx}>Available Packs</Typography>
              <TextField fullWidth size="small" sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={labelSx}>Available Stock</Typography>
              <TextField fullWidth size="small" sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={labelSx}>Stock on Hand</Typography>
              <TextField fullWidth size="small" sx={inputSx} />
            </Box>
          </Box>
        </Box>

        {/* Row group 3: Sale tag icon — Cost Price / Sell Price */}
        <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 2 }}>
          <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
            <HugeiconsIcon icon={SaleTag02Icon} size={24} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            <Box>
              <Typography sx={labelSx}>Cost Price</Typography>
              <TextField
                fullWidth size="small" sx={inputSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 14, color: '#555770' }}>$</Typography></InputAdornment>,
                }}
              />
            </Box>
            <Box>
              <Typography sx={labelSx}>Sell Price</Typography>
              <TextField
                fullWidth size="small" sx={inputSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 14, color: '#555770' }}>$</Typography></InputAdornment>,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Row group 4: Info icon — Barcode / Campaign/Program / Supplier / VVM Status */}
        <Box sx={{ position: 'relative', pl: `${ICON_COL_WIDTH}px`, mb: 3 }}>
          <Box sx={{ position: 'absolute', left: 0, top: '28px', color: '#555770' }}>
            <HugeiconsIcon icon={InformationSquareIcon} size={24} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            <Box>
              <Typography sx={labelSx}>Barcode</Typography>
              <TextField fullWidth size="small" sx={inputSx} />
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
              <Typography sx={labelSx}>Supplier</Typography>
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
              <Typography sx={labelSx}>VVM Status</Typography>
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
            Ok
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
}
