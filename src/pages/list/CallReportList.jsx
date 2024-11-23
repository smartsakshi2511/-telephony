import React, { useState, useEffect } from "react";
import "./list.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import {
  Download as DownloadIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";

const CallReportList = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const columns = [
    { field: "sr", headerName: "SR", width: isMobile ? 50 : 70, headerClassName: "customHeader" },
    { field: "agentName", headerName: "AGENT NAME", width: isMobile ? 120 : 150, headerClassName: "customHeader" },
    { field: "agentId", headerName: "AGENT ID", width: isMobile ? 80 : 100, headerClassName: "customHeader" },
    { field: "callFrom", headerName: "CALL FROM", width: 150, headerClassName: "customHeader" },
    { field: "callTo", headerName: "CALL TO", width: 150, headerClassName: "customHeader" },
    { field: "campaignName", headerName: "CAMPAIGN NAME", width: 150, headerClassName: "customHeader" },
    { field: "startTime", headerName: "START TIME", width: 180, headerClassName: "customHeader" },
    { field: "duration", headerName: "DURATION", width: 100, headerClassName: "customHeader" },
    { field: "direction", headerName: "DIRECTION", width: 100, headerClassName: "customHeader" },
    { field: "status", headerName: "STATUS", width: 100, headerClassName: "customHeader" },
    { field: "hangup", headerName: "HANGUP", width: 100, headerClassName: "customHeader" },
    {
      field: "recording",
      headerName: "Recording",
      width: 180,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2" }}>
          Listen
        </a>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    sr: "",
    agentName: "",
    agentId: "",
    callFrom: "",
    callTo: "",
    campaignName: "",
    startTime: "",
    duration: "",
    direction: "",
    status: "",
    hangup: "",
    recording: "",
  });

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get("https://api.example.com/calls");
        setData(response.data.calls);
      } catch (error) {
        console.error("Error fetching calls:", error);
        setData([
          {
            sr: 1,
            agentName: "John Doe",
            agentId: "A001",
            callFrom: "+1234567890",
            callTo: "+0987654321",
            campaignName: "Campaign X",
            startTime: "2023-08-01 10:00 AM",
            duration: "00:05:30",
            direction: "Inbound",
            status: "Completed",
            hangup: "Yes",
            recording: "https://example.com/recording1",
          },
        ]);
      }
    };
    fetchCalls();
  }, []);

  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data available to download.");
      return;
    }
    const excelData = data.map((item) => ({
      SR: item.sr,
      "Agent Name": item.agentName,
      "Agent ID": item.agentId,
      "Call From": item.callFrom,
      "Call To": item.callTo,
      "Campaign Name": item.campaignName,
      "Start Time": item.startTime,
      Duration: item.duration,
      Direction: item.direction,
      Status: item.status,
      Hangup: item.hangup,
      Recording: item.recording,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "call_data.xlsx");
  };

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const handleFilterSubmit = () => {
    const filteredData = data.filter((call) => {
      const callDate = new Date(call.startTime);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return (
        (!fromDate || callDate >= from) &&
        (!toDate || callDate <= to) &&
        (!selectedAgent || call.agentId === selectedAgent)
      );
    });
    setData(filteredData);
    handleFilterDialogClose();
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>TOTAL CALL REPORTS</b>
        <div className="callFilter">
        <Button
  variant="outlined"
  onClick={handleFilterDialogOpen}
  endIcon={<FilterListIcon />}
  sx={{ marginRight: "10px" }}
>
  Filter
</Button>

          <Tooltip title="Download Data">
            <Button
              variant="outlined"
              onClick={handleDownload}
              sx={{
                background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                color: "white",
              }}
            >
              Export <DownloadIcon />
            </Button>
          </Tooltip>
        </div>
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        getRowId={(row) => row.sr}
        disableSelectionOnClick
      />
      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Call Records</DialogTitle>
        <DialogContent>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFilterSubmit} color="primary">
            Filter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CallReportList;
