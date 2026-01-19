import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Pagination,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const LoginReport = () => {
  const [loginData, setLoginData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState({ fromDate: "", toDate: "" });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchLoginData();
  }, []);

  const fetchLoginData = () => {
    setLoading(true);
    axios
      .get(
        `https://${window.location.hostname}:4000/telephony/agent-login-report`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const formattedData = response.data.map((item, index) => ({
          id: index + 1,
          userId: item.user_name,
          userName: item.user_name,
          loginTime: item.log_in_time
            ? dayjs(item.log_in_time).format("DD-MM-YYYY HH:mm:ss")
            : "",
          logoutTime: item.log_out_time
            ? dayjs(item.log_out_time).format("DD-MM-YYYY HH:mm:ss")
            : "",
          status: item.status,
        }));
        setLoginData(formattedData);
        setFilteredData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching login data:", error);
        setLoading(false);
      });
  };

  const handleFilter = () => {
    const { fromDate, toDate } = filterDate;
    if (!fromDate || !toDate || new Date(fromDate) > new Date(toDate)) {
      alert("Please select a valid date range");
      return;
    }

    const filtered = loginData.filter((item) => {
      const loginDate = new Date(item.loginTime.split(" ")[0].split("-").reverse().join("-"));
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return loginDate >= from && loginDate <= to;
    });
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = loginData.filter((item) =>
      item.userName.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h5"
        gutterBottom
        style={{ fontWeight: "bold", color: "#5e6266" }}
      >
        USER LOGIN REPORTS
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by User Name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={filterDate.fromDate}
            onChange={(e) =>
              setFilterDate({ ...filterDate, fromDate: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={filterDate.toDate}
            onChange={(e) =>
              setFilterDate({ ...filterDate, toDate: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleFilter}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            fontSize: "0.85rem",
            borderCollapse: "collapse",
            minWidth: "700px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Sr.</th>
              <th style={thStyle}>USER ID</th>
              <th style={thStyle}>USER NAME</th>
              <th style={thStyle}>LOGIN TIME</th>
              <th style={thStyle}>LOGOUT TIME</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No data found.
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{indexOfFirstRow + index + 1}</td>
                  <td style={tdStyle}>{row.userId}</td>
                  <td style={tdStyle}>{row.userName}</td>
                  <td style={tdStyle}>{row.loginTime}</td>
                  <td style={tdStyle}>{row.logoutTime}</td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        backgroundColor:
                          row.status === 1 ? "#FFF9C4" : "#FFCDD2",
                        color: row.status === 1 ? "#FBC02D" : "#D32F2F",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontWeight: "bold",
                        display: "inline-block",
                        minWidth: "80px",
                      }}
                    >
                      {row.status === 1 ? "Login" : "Logout"}
                    </div>
                  </td>
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
    </div>
  );
};

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

export default LoginReport;
