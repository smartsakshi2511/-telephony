// PhoneIframe.jsx
import React from 'react';
import { Grid } from '@mui/material';

const Phone = ({ visible }) => {
  if (!visible) return null;  

  return (
    <Grid>
      <iframe
        title="Phone"
        src="https://www.wikipedia.org"
        width="100%"
        height="400px"
        style={{ border: '1px solid #ccc' }}
      ></iframe>
    </Grid>
  );
};

export default Phone;
