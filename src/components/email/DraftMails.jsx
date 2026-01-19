// DraftMails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DraftMails = () => {
  const [drafts, setDrafts] = useState([]);

  const fetchDrafts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`https://${window.location.hostname}:4000/draft-emails`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDrafts(res.data || []);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>Draft Emails</Typography>
      <Paper>
        <DataGrid
          rows={drafts.map((e, i) => ({ id: i + 1, ...e }))}
          columns={[
            { field: "to_emails", headerName: "To", flex: 1 },
            { field: "subject", headerName: "Subject", flex: 1 },
            { field: "Create_time", headerName: "Saved On", flex: 1, valueGetter: p => new Date(p.row.Create_time).toLocaleString() },
          ]}
          autoHeight
          pageSize={10}
        />
      </Paper>
    </Box>
  );
};

export default DraftMails;
