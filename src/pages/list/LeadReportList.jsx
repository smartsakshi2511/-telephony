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
 
  TextField,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";
import {
 
  Download as DownloadIcon,
  
} from "@mui/icons-material";

const LeadReportList = () => {
  const columns = [
    { field: "sr", headerName: "SR", flex: 0.5 },
  
    { field: "agentId", headerName: "AGENT ID", flex: 1.5, headerClassName: "customHeader" },
    { field: "agentName", headerName: "CALLER NAME", flex: 1.5, headerClassName: "customHeader" },
    { field: "callFrom", headerName: "CALLER NUMBER", flex: 1.5, headerClassName: "customHeader" },
    { field: "callTo", headerName: "EMAIL", flex: 1.5, headerClassName: "customHeader" },
    { field: "campaignName", headerName: "DIAL STATUS", flex: 1.5, headerClassName: "customHeader" },
    { field: "startTime", headerName: "DATE", flex: 2, headerClassName: "customHeader" },
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
   
          },
          {
            sr: 2,
            agentName: "Jane Smith",
            agentId: "A002",
            callFrom: "+1234567891",
            callTo: "+0987654322",
            campaignName: "Campaign Y",
 
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
      <b>TOTAL LEAD REPORTS</b>
        <div className="callFilter">
   <Tooltip title="Filter the data by date and Agent">
   <Button variant="outlined" onClick={handleFilterDialogOpen}  endIcon={<GridFilterListIcon/>} style={{
                marginRight: '20px'
              }}>
          Filter
        </Button>
   </Tooltip>
        <Tooltip title="Download Data">
          <Button variant="outlined" onClick={handleDownload}  style={{
                background: "linear-gradient(90deg, #4caf50, #2e7d32)", // Green gradient
                color: "white",
                borderColor: "#4caf50",
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
        style={{ fontSize: '12px' }}
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

export default LeadReportList;
