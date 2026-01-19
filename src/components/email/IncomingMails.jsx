import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import qp from "quoted-printable";

const IncomingMails = () => {
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchInbox = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://${window.location.hostname}:4000/incoming-emails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmails(res.data || []);
    } catch (error) {
      console.error("Failed to fetch inbox emails:", error);
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 30000); // optional auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const filteredEmails = emails.filter(
    (email) =>
      email.from?.toLowerCase().includes(search.toLowerCase()) ||
      email.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const cleanBody = (raw) => {
    try {
      // Match plain text part of MIME content
      const match = raw.match(
        /Content-Type: text\/plain[^]*?(?=(Content-Type|$))/i
      );
      if (!match) return "Could not parse email.";

      const lines = match[0].split("\n");
      const bodyStartIndex = lines.findIndex((line) => line.trim() === "") + 1;

      const encodedBody = lines.slice(bodyStartIndex).join("\n").trim();
      const decoded = qp.decode(encodedBody).toString("utf8");

      return decoded;
    } catch (err) {
      return "Error decoding email.";
    }
  };
  const columns = [
    { field: "from", headerName: "From", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 1 },
    {
      field: "date",
      headerName: "Received",
      flex: 1,
      valueGetter: (params) =>
        params.row.date ? new Date(params.row.date).toLocaleString() : "N/A",
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="View Email">
          <IconButton onClick={() => setSelectedEmail(params.row)}>
            <VisibilityIcon sx={{ color: "blue", fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = filteredEmails.map((email, index) => ({
    id: index + 1,
    ...email,
  }));

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">📥 Inbox</Typography>
        <IconButton onClick={fetchInbox} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="🔍 Search by sender or subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={columns}
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

      <Dialog
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle>📧 Email Content</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            <strong>From:</strong> {selectedEmail?.from}
          </Typography>
          <Typography>
            <strong>Subject:</strong> {selectedEmail?.subject}
          </Typography>
          <Typography mt={2}>
            <strong>Message:</strong>
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line", mt: 1 }}>
            {selectedEmail?.body
              ? cleanBody(selectedEmail.body)
              : "No content."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedEmail(null)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomingMails;
