import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Pagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const AgentReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    axios
      .get(`https://${window.location.hostname}:4000/telephony/agentReport`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const formattedData = response.data.map((item, index) => ({
          id: index + 1,
          user_id: item.user_id,
          no_of_breaks: item.no_of_breaks,
          break_names: item.break_names,
          login_time: item.login_time
            ? dayjs(item.login_time).format("DD-MM-YYYY HH:mm:ss")
            : "",
          no_of_ans: item.no_of_ans,
          no_of_can: item.no_of_can,
          no_of_tot: item.no_of_tot,
        }));

        const reversed = formattedData.reverse();
        setData(reversed);
        setFilteredData(reversed);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data!", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (fromDate && toDate) {
      const filtered = data.filter((agent) => {
        const loginDate = new Date(
          agent.login_time.split(" ")[0].split("-").reverse().join("-")
        );
        return loginDate >= new Date(fromDate) && loginDate <= new Date(toDate);
      });
      setFilteredData(filtered);
      setPage(1);
    } else {
      setFilteredData(data);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Report Data");
    XLSX.writeFile(workbook, "AgentReportData.xlsx");
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedRows = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography
          variant="h5"
          gutterBottom
          style={{ fontWeight: "bold", color: "#5e6266" }}
        >
          AGENT REPORTS
        </Typography>
      </Grid>

<Grid container spacing={2} style={{ marginBottom: 20 }}>
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      fullWidth
      size="small"
      type="date"
      label="From Date"
      InputLabelProps={{ shrink: true }}
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <TextField
      fullWidth
      size="small"
      type="date"
      label="To Date"
      InputLabelProps={{ shrink: true }}
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <Button
      fullWidth
      size="small"
      variant="contained"
      color="primary"
      onClick={handleSearch}
      style={{ height: '100%' }}
    >
      Search
    </Button>
  </Grid>

  <Grid
    item
    xs={12}
    sm={6}
    md={3}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
  >
    <Tooltip title="Export to Excel">
      <IconButton onClick={handleExport} color="primary">
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  </Grid>
</Grid>


      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            fontSize: "0.85rem",
            borderCollapse: "collapse",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Sr.</th>
              <th style={thStyle}>USER ID</th>
              <th style={thStyle}>NO. OF BREAKS</th>
              <th style={thStyle}>BREAK NAMES</th>
              <th style={thStyle}>LOGIN TIME</th>
              <th style={thStyle}>NO. OF ANS</th>
              <th style={thStyle}>NO. OF CAN</th>
              <th style={thStyle}>NO. OF TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr key={index}>
                  <td style={tdStyle}>
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  <td style={tdStyle}>{row.user_id}</td>
                  <td style={tdStyle}>{row.no_of_breaks}</td>
                  <td style={tdStyle}>{row.break_names}</td>
                  <td style={tdStyle}>{row.login_time}</td>
                  <td style={tdStyle}>{row.no_of_ans}</td>
                  <td style={tdStyle}>{row.no_of_can}</td>
                  <td style={tdStyle}>{row.no_of_tot}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
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
    </div>
  );
};

// Reusable styles like LoginReport
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

export default AgentReport;
