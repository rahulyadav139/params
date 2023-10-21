import {
  Typography,
  TextField,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  IconButton,
  Link,
} from '@mui/material';
import { Add, ContentCopy } from '@mui/icons-material';
import { useState } from 'react';
import { Param } from './components';
import { v4 as uuid } from 'uuid';
import { regex } from './utils';
import utmParameters from './assets/utm-parameters.json';

interface IQueryParams {
  id: string;
  key: string;
  value: string;
}

function App() {
  const [link, setLink] = useState<string>('');
  const [linkWithParams, setLinkWithParams] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState<IQueryParams[]>([]);

  const handleAddQueryParam = (id?: string, key?: string): void => {
    setIsFormValid(true);
    const tempId = uuid();
    setQueryParams(prev => [
      ...prev,
      { id: id ?? tempId, key: key ?? '', value: '' },
    ]);
  };

  const handleDeleteQueryParam = (id: string) => {
    setQueryParams(prev => prev.filter(q => q.id !== id));
    setLinkWithParams('');
  };

  const handleUpdateInput = (
    id: string,
    type: 'key' | 'value',
    input: string
  ) => {
    setQueryParams(prev =>
      prev.map(el => (el.id === id ? { ...el, [type]: input } : el))
    );
  };

  const linkGenerator = () => {
    if (!regex.website.test(link)) return setIsFormValid(false);
    else setIsFormValid(true);

    const params = new URLSearchParams();

    let error: boolean = false;

    for (const el of queryParams) {
      if (!el.key || !el.value) {
        error = true;
        break;
      }
      params.append(el.key, el.value);
    }

    setIsFormValid(!error);

    if (error) return;

    setLinkWithParams(link + '?' + params.toString());
  };

  const suggestions = utmParameters.filter(
    p => !queryParams.some(q => q.id === p.id)
  );

  return (
    <>
      <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography gutterBottom variant="body1" sx={{ opacity: 0.5 }}>
          Paste your link here
        </Typography>
        <TextField
          error={!isFormValid && !regex.website.test(link)}
          value={link}
          onChange={e => setLink(e.target.value.trim())}
          size="small"
          fullWidth
          placeholder="https://example.com"
        />

        {Boolean(queryParams.length) && (
          <>
            <Typography
              sx={{ opacity: 0.5 }}
              marginTop={2}
              gutterBottom
              variant="body1"
            >
              Query params :
            </Typography>
            {/* <Divider /> */}

            {queryParams.map(q => (
              <Param
                key={q.id}
                id={q.id}
                query={q.key}
                value={q.value}
                onUpdate={handleUpdateInput}
                onRemove={handleDeleteQueryParam}
                isFormValid={isFormValid}
              />
            ))}
          </>
        )}

        <Button
          disableElevation
          variant="contained"
          onClick={() => handleAddQueryParam()}
          sx={{ textTransform: 'initial', my: 2 }}
        >
          Add Param
        </Button>

        {Boolean(suggestions.length) && (
          <>
            <Typography variant="body1">Suggestions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {suggestions.map(p => (
                <Chip
                  key={p.id}
                  label={p.label}
                  clickable
                  icon={<Add fontSize="small" />}
                  onClick={() => handleAddQueryParam(p.id, p.key)}
                />
              ))}
            </Box>
          </>
        )}

        <Button
          disableElevation
          disabled={!Boolean(link) || !Boolean(queryParams.length)}
          variant="contained"
          onClick={linkGenerator}
          sx={{ mt: 3, textTransform: 'initial', display: 'block' }}
        >
          Get Link
        </Button>

        {Boolean(linkWithParams) && (
          <>
            <Divider sx={{ my: 5 }} />

            <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <Typography variant="h5">Link</Typography>
              <IconButton
                onClick={() => {
                  window.navigator.clipboard.writeText(linkWithParams);
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Stack>

            <Link
              underline="hover"
              href={linkWithParams}
              rel="noopener noreferrer"
              target="_blank"
              variant="body2"
              sx={{ fontStyle: 'italic', cursor: 'pointer' }}
            >
              {linkWithParams}
            </Link>
          </>
        )}
      </Box>
    </>
  );
}

export default App;
