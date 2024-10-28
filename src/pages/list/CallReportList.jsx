import React, { useState, useEffect } from "react";
import "./list.scss";
import { DataGrid, GridFilterListIcon } from "@mui/x-data-grid";
 
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  FilterList,
} from "@mui/icons-material";

const CallReportList = () => {
  const columns = [
    { field: "sr", headerName: "SR", width: 70 },
    { field: "agentName", headerName: "AGENT NAME", width: 150 },
    { field: "agentId", headerName: "AGENT ID", width: 100 },
    { field: "callFrom", headerName: "CALL FROM", width: 150 },
    { field: "callTo", headerName: "CALL TO", width: 150 },
    { field: "campaignName", headerName: "CAMPAIGN NAME", width: 150 },
    { field: "startTime", headerName: "START TIME", width: 180 },
    { field: "duration", headerName: "DURATION", width: 100 },
    { field: "direction", headerName: "DIRECTION", width: 100 },
    { field: "status", headerName: "STATUS", width: 100 },
    { field: "hangup", headerName: "HANGUP", width: 100 },
    {
      field: "recording",
      headerName: "Recording",
      width: 180,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1976d2", textDecoration: "none" }}
        >
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
  
  // New states for filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/calls");
        setData(response.data.calls); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching calls:", error);
        // Fallback to predefined calls if API fails
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
          {
            sr: 2,
            agentName: "Jane Smith",
            agentId: "A002",
            callFrom: "+1234567891",
            callTo: "+0987654322",
            campaignName: "Campaign Y",
            startTime: "2023-08-02 11:00 AM",
            duration: "00:03:45",
            direction: "Outbound",
            status: "Missed",
            hangup: "No",
            recording: "https://example.com/recording2",
          },
          // Add more rows as needed
        ]);
      }
    };

    fetchCalls();
  }, []);

  // Function to download the data as an Excel file
  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data available to download.");
      return;
    }
    const excelData = data.map((item) => ({
      "SR": item.sr,
      "Agent Name": item.agentName,
      "Agent ID": item.agentId,
      "Call From": item.callFrom,
      "Call To": item.callTo,
      "Campaign Name": item.campaignName,
      "Start Time": item.startTime,
      "Duration": item.duration,
      "Direction": item.direction,
      "Status": item.status,
      "Hangup": item.hangup,
      "Recording": item.recording,
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
    // You can implement the filtering logic here based on fromDate, toDate, and selectedAgent
    // For example, if your data has a startTime field, you can filter like this:
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
      TOTAL CALL REPORTS
              <div className="callFilter">
        <Button variant="outlined" onClick={handleFilterDialogOpen}  endIcon={<GridFilterListIcon/>} style={{
                marginRight: '20px'
              }}>
          Filter
        </Button>
        <Tooltip title="Download Data">
          <Button variant="outlined" onClick={handleDownload}  style={{
                backgroundColor: 'green',
                color: 'white',
                borderColor: 'green',
              }}>
            Export<DownloadIcon />
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
            label="Select Agent"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            fullWidth
            margin="normal"
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
          <Button onClick={handleFilterDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleFilterSubmit} color="primary">Filter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CallReportList;
