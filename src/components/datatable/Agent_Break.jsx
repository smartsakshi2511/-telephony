import "./datatable.scss";
import React, { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Sample data for the table
const usersData = [
  { id: 1, UserID: 8081, BreakName: 'Ready', status: 'active', date: '2024-10-15 03:39:25' },
  { id: 2, UserID: 8081, BreakName: 'Ready', status: 'deacti', date: '2024-10-14 07:19:07' },
  { id: 3, UserID: 8081, BreakName: 'Ready', status: 'deacti', date: '2024-10-13 08:00:00' },
  { id: 4, UserID: 8081, BreakName: 'Ready', status: 'active', date: '2024-10-12 09:00:00' },
  { id: 5, UserID: 8081, BreakName: 'Ready', status: 'passiv', date: '2024-10-11 10:00:00' },
  { id: 6, UserID: 8081, BreakName: 'Ready', status: 'active', date: '2024-10-10 11:00:00' },
  { id: 7, UserID: 8081, BreakName: 'Ready', status: 'passiv', date: '2024-10-15 03:39:25' },
  { id: 8, UserID: 8081, BreakName: 'Ready', status: 'active', date: '2024-10-14 07:19:07' },
  { id: 9, UserID: 8081, BreakName: 'Ready', status: 'pendir', date: '2024-10-13 08:00:00' },
];

const DateFilterComponent = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(usersData);
  

  // Columns definition for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "UserID", headerName: "	USER ID", width: 150 },
    { field: "BreakName", headerName: "BREAK NAME", width: 150 },
    { field: "status", headerName: "STATUS", width: 150 },
    { field: "date", headerName: "TAKE BREAK TIME", width: 160 },
    { field: "date", headerName: "BREAK DURATION", width: 170 },

    // {
    //   field: "action",
    //   headerName: "Action",
    //   width: 200,
    //   renderCell: (params) => (
    //     <div className="cellAction">
    //       <VisibilityIcon style={{ cursor: "pointer", color: "blue", marginRight: "10px" }} />
    //       <EditIcon style={{ cursor: "pointer", color: "green", marginRight: "10px" }} />
    //       <DeleteIcon style={{ cursor: "pointer", color: "red" }} />
    //     </div>
    //   ),
    // },
  ];

  // Handle From Date Change
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  // Handle To Date Change
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  // Filter data based on the date range
  const handleSearch = () => {
    console.log(`Search clicked with fromDate: ${fromDate}, toDate: ${toDate}`);
    if (fromDate && toDate) {
      const filtered = usersData.filter(
        (user) => user.date >= fromDate && user.date <= toDate
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(usersData); // Reset to original data if date is not specified
    }
  };

  // Handle Export Button Click
  const handleExport = () => {
    console.log('Export Data clicked');
    setIsModalOpen(true);
  };

  // Close the Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="date-filter-container">
      <h2 className="title">VIEW AGENT BREAK</h2>

      {/* Date Filter Inputs */}
      <div className="date-filter-fields">
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          InputLabelProps={{ shrink: true }}
          className="date-input"
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          InputLabelProps={{ shrink: true }}
          className="date-input"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          className="action-button"
        >
          Search
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExport}
          className="action-button"
        >
          Export Data
        </Button>
      </div>

      {/* DataGrid for displaying data */}
      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
        />
      </div>

      {/* Modal for export */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle className="dialog-title">Export Data</DialogTitle>
        <DialogContent className="dialog-content">
          <p>Your data has been exported successfully!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DateFilterComponent;
