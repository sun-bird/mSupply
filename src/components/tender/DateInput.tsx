import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface DateInputProps {
  /** Current ISO date string (`YYYY-MM-DD`). Empty string = no value. */
  value: string;
  onChange: (iso: string) => void;
  /** Styling for the inner text-field input wrapper. The same `inputSx` /
   *  `dateInputSx` blocks the rest of the form uses keep visual parity. */
  sx: SxProps<Theme>;
}

const ISO_FORMAT = 'YYYY-MM-DD';

/**
 * MUI X `DatePicker` styled to match the surrounding tender form. The
 * popover calendar inherits the active MUI theme (Inter, primary teal,
 * dark/light mode) automatically.
 *
 * Inputs/outputs are ISO date strings (`YYYY-MM-DD`) so callers don't have
 * to know about Day.js — keeps the component a drop-in replacement for the
 * previous native `<input type="date">` version.
 */
export default function DateInput({ value, onChange, sx }: DateInputProps) {
  const parsed = value ? dayjs(value, ISO_FORMAT) : null;

  return (
    <DatePicker
      value={parsed}
      onChange={(next) => onChange(next?.isValid() ? next.format(ISO_FORMAT) : '')}
      // Match the placeholder text of the previous native input so the
      // empty state still reads "dd/mm/yyyy".
      format="DD/MM/YYYY"
      // Replace the picker's default open icon with the Hugeicons
      // calendar so it matches the rest of the app's iconography.
      slots={{
        openPickerIcon: () => (
          <HugeiconsIcon icon={Calendar03Icon} size={14} color="currentColor" />
        ),
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          // MUI X v9's picker has its own DOM (`MuiPickersOutlinedInput-*`)
          // and ignores styles set on the outer TextField root, so we push
          // the caller's `sx` onto the actual visible field instead. That
          // restores the previous InputBase look — `action.hover` bg,
          // 36px height, no outline, ghost-text color when empty.
          sx: {
            // The picker has an intrinsic min-content width (the formatted
            // DD/MM/YYYY editable sections). Set min-width: 0 on both the
            // outer FormControl and the inner picker root so the field can
            // shrink to whatever its FormRow column allows — matching the
            // dropdown columns' width again.
            minWidth: 0,
            '& .MuiPickersOutlinedInput-root': { ...(sx as Record<string, unknown>), minWidth: 0 },
            '& .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiPickersInputBase-sectionsContainer': { padding: 0, minWidth: 0 },
          },
        },
        openPickerButton: {
          size: 'small',
          sx: {
            color: 'text.secondary',
            transition: 'color 0.15s, background-color 0.15s',
            '&:hover': { color: '#3E7BFA', bgcolor: 'rgba(62,123,250,0.08)' },
          },
        },
        // Match the popover's corner radius to the Tender Details section
        // card so the calendar surface reads as part of the same panel.
        desktopPaper: {
          sx: { borderRadius: '10px' },
        },
        mobilePaper: {
          sx: { borderRadius: '10px' },
        },
      }}
    />
  );
}
