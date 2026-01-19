import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  IconButton,
  Divider,
  Tooltip,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const OutgoingMails = () => {
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState({ to_emails: "", subject: "", body: "" });
  const [status, setStatus] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchSent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://${window.location.hostname}:4000/emails`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmails(res.data || []);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://${window.location.hostname}:4000/send-email`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ to_emails: "", subject: "", body: "" });
      setStatus("✅ Email sent!");
      fetchSent();
    } catch (err) {
      console.error("Failed to send email:", err);
      setStatus("❌ Failed to send.");
    }
  };

  useEffect(() => {
    fetchSent();
  }, []);

  return (
    <Box p={2}>
      {/* Compose Email */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 3,
          maxWidth: 700,
          mx: "auto",
          background: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ✉️ New Message
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="To"
              value={form.to_emails}
              onChange={(e) =>
                setForm({ ...form, to_emails: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={8}
              placeholder="Write your message..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              sx={{
                "& textarea": { fontSize: "0.95rem", lineHeight: 1.6 },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSend}
                  sx={{ borderRadius: 2 }}
                >
                  Send
                </Button>
                {status && (
                  <Typography variant="body2" color="green">
                    {status}
                  </Typography>
                )}
              </Box>

              <Box>
                <Tooltip title="Attach file">
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Insert emoji">
                  <IconButton>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Sent Emails */}
      <Typography variant="h6" mb={1}>
        📤 Sent Emails
      </Typography>
      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={emails.map((e, i) => ({ id: i + 1, ...e }))}
          columns={[
            { field: "to_emails", headerName: "To", flex: 1 },
            { field: "subject", headerName: "Subject", flex: 1 },
            {
              field: "Create_time",
              headerName: "Date",
              flex: 1,
              valueGetter: (p) =>
                new Date(p.row.Create_time).toLocaleString(),
            },
          ]}
          autoHeight
          pageSize={10}
          sx={{
            border: 0,
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OutgoingMails;
