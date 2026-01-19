import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  Autocomplete,
  Pagination,
} from "@mui/material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const DateFilterComponent = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    axios
      .get(`https://${window.location.hostname}:4000/telephony/agent-breaks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const formattedData = response.data.map((item, index) => ({
          id: index + 1,
          user_name: item.user_id,
          break_name: item.break_name,
          status: item.break_status,
          start_time: item.start_time
            ? dayjs(item.start_time).format("DD-MM-YYYY HH:mm:ss")
            : "",
          break_duration: item.break_duration,
        }));

        setData(formattedData); // No reverse (ascending ID order)
        setFilteredData(formattedData);
        setUsers([...new Set(formattedData.map((item) => item.user_name))]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data!", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    let filtered = data;
    if (fromDate && toDate) {
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.start_time)
          .toISOString()
          .split("T")[0];
        return userDate >= fromDate && userDate <= toDate;
      });
    }
    if (selectedUser) {
      filtered = filtered.filter((user) => user.user_name === selectedUser);
    }
    setFilteredData(filtered);
    setPage(1); // Reset to first page on search
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Break Data");
    XLSX.writeFile(workbook, "AgentBreakData.xlsx");
    setIsModalOpen(true);
  };

  // Pagination logic
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        AGENTS BREAK
      </Typography>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option}
          value={selectedUser}
          onChange={(event, newValue) => setSelectedUser(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select User ID" size="small" />
          )}
          style={{ minWidth: 200 }}
        />
        <TextField
          label="From Date"
          type="date"
          size="small"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          size="small"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Tooltip title="Export Data">
          <IconButton
            color="success"
            onClick={handleExport}
            size="large"
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            fontSize: "0.85rem",
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>USER ID</th>
              <th style={thStyle}>BREAK NAME</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>TAKE BREAK TIME</th>
              <th style={thStyle}>BREAK DURATION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  Loading...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  No data found.
                </td>
              </tr>
            ) : (
              currentRows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.id}</td>
                  <td style={tdStyle}>{row.user_name}</td>
                  <td style={tdStyle}>{row.break_name}</td>
                  <td style={tdStyle}>{row.status}</td>
                  <td style={tdStyle}>{row.start_time}</td>
                  <td style={tdStyle}>{row.break_duration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* Export Success Dialog */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          Your data has been exported successfully!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Table Styles
const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

export default DateFilterComponent;
