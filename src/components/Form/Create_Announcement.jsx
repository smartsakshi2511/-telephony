import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';
import Swal from 'sweetalert2';
import { useState } from 'react';
import axios from 'axios';

const CreateAnnouncementDialog = ({ open, onClose, onPostSuccess }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      Swal.fire('Error', 'Announcement message cannot be empty.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `https://${window.location.hostname}:4000/announcements/create`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire('Success', res.data.message || 'Announcement posted.', 'success');
      setMessage('');
      onClose(); // close dialog
      if (onPostSuccess) onPostSuccess(); // notify parent to refresh
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Failed to post announcement.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <CampaignIcon sx={{ color: 'rgb(68, 0, 255)' }} />
            <Typography variant="h6">Create Announcement</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Announcement Message"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            margin="normal"
            placeholder="🚨 Please complete your tasks before 5 PM."
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: 'rgb(68, 0, 255)',
                '&:hover': { backgroundColor: 'rgb(50, 0, 200)' },
              }}
              disabled={submitting}
              startIcon={submitting && <CircularProgress size={18} />}
            >
              {submitting ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default CreateAnnouncementDialog;
