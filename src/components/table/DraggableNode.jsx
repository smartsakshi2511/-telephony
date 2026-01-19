import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Select, MenuItem, FormControl, InputLabel, Paper
} from "@mui/material";
import axios from "axios";

const AgentSummary = () => {
  const [filterData, setFilterData] = useState("today");
  const [status, setStatus] = useState("All");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch data when filters change
    fetchData();
    // Auto-refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [filterData, status]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/agents", {
        params: { filterData, status },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilterData(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const getStatusStyle = (row) => {
    if (row.break_status === "2" && row.status === "2") {
      return { backgroundColor: "#A6F7A5", color: "black" }; // Ready
    }
    if (row.break_status === "2" && row.status === "3") {
      return row.Calldirection === "inbound"
        ? { backgroundColor: "blue", color: "white" }
        : { backgroundColor: "purple", color: "white" };
    }
    if (row.break_status === "1" && row.status === "1") {
      return { backgroundColor: "#E5F0A1", color: "black" }; // Break
    }
    return { backgroundColor: "red", color: "white" }; // Logout
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agents Summary</h2>
      <FormControl style={{ marginRight: "20px", minWidth: 150 }}>
        <InputLabel>Filter</InputLabel>
        <Select value={filterData} onChange={handleFilterChange}>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>
      <FormControl style={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={handleStatusChange}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Ready">Ready</MenuItem>
          <MenuItem value="pause">Pause</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agents</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Call</TableCell>
              <TableCell>Ready/Pause</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Talk</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Cancel</TableCell>
              <TableCell>Other</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((row, index) => (
                <TableRow key={index} style={getStatusStyle(row)}>
                  <TableCell>{row.user_name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.wait_duration_seconds}</TableCell>
                  <TableCell>{row.ready_seconds}</TableCell>
                  <TableCell>{row.login_duration}</TableCell>
                  <TableCell>{row.total_duration_A_call}</TableCell>
                  <TableCell>{row.total_ans_call_agent}</TableCell>
                  <TableCell>{row.total_can_call_agent}</TableCell>
                  <TableCell>{row.total_oth_call_agent}</TableCell>
                  <TableCell>{row.total_call_agent}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AgentSummary;
