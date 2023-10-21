import { FC } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface IParam {
  id: string;
  query: string;
  value: string;
  onUpdate: (id: string, key: 'key' | 'value', input: string) => void;
  onRemove: (id: string) => void;
  isFormValid: boolean;
}

export const Param: FC<IParam> = ({
  id,
  query,
  value,
  onUpdate,
  onRemove,
  isFormValid,
}) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        value={query}
        placeholder="Key"
        size="small"
        fullWidth
        disabled={Boolean(query.startsWith('utm_'))}
        onChange={e => onUpdate(id, 'key', e.target.value)}
        error={!isFormValid && !query}
      />

      <TextField
        value={value}
        placeholder="Value"
        size="small"
        fullWidth
        onChange={e => onUpdate(id, 'value', e.target.value)}
        error={!isFormValid && !value}
      />
      <IconButton onClick={() => onRemove(id)}>
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};
