import { Box, Typography } from '@mui/material';
import type { ChangeEvent, DragEvent } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ACCEPTED_EXTENSIONS = ['.pdf', '.xls', '.xlsx', '.rtf', '.doc', '.docx'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/rtf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface DocumentDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export default function DocumentDropZone({ onFilesAdded }: DocumentDropZoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const filterValidFiles = (fileList: FileList) => {
    return Array.from(fileList).filter(
      (f) => ACCEPTED_MIME_TYPES.includes(f.type) ||
        ACCEPTED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))
    );
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const valid = filterValidFiles(e.dataTransfer.files);
    if (valid.length > 0) onFilesAdded(valid);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const valid = filterValidFiles(e.target.files);
      if (valid.length > 0) onFilesAdded(valid);
    }
    e.target.value = '';
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      sx={{
        bgcolor: dragOver ? 'rgba(62,123,250,0.15)' : 'rgba(62,123,250,0.08)',
        border: '2px solid #3E7BFA',
        borderRadius: '10px',
        py: 3,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': { bgcolor: 'rgba(62,123,250,0.15)' },
      }}
      onClick={() => inputRef.current?.click()}
    >
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          color: '#3E7BFA',
        }}
      >
        {t('tenderPlan.dragAndDrop')}{' '}
        <Typography
          component="span"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: '#3E7BFA',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          {t('tenderPlan.selectDocument')}
        </Typography>{' '}
        {t('tenderPlan.documentToUpload')}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}
