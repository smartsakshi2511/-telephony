import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Grid, Typography } from '@mui/material';
import './datatable.scss';

const LoginReport = () => {
  const [loginData, setLoginData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState({ fromDate: '', toDate: '' });
  const [pageSize, setPageSize] = useState(10); 

  // Example data
  const exampleData = [
    { userId: 8081, userName: '8081', loginTime: '2024-06-25 03:54:50', logoutTime: '2024-06-25 18:20:45', totalTime: '18:20:45', status: 'Logout' },
    { userId: 8082, userName: '8082', loginTime: '2024-06-25 04:59:07', logoutTime: '2024-06-25 18:23:14', totalTime: '18:23:14', status: 'Logout' },
    { userId: 8083, userName: '8083', loginTime: '2024-06-25 05:09:40', logoutTime: '2024-06-25 18:45:07', totalTime: '18:45:07', status: 'Logout' },
    // Add more data...
  ];

  useEffect(() => {
    setLoginData(exampleData);
  }, []);

  // Filter by Date Range
  const handleFilter = () => {
    const { fromDate, toDate } = filterDate;

    if (new Date(fromDate) > new Date(toDate)) {
      alert("Invalid date range");
      return;
    }

    const filtered = exampleData.filter(item => {
      const loginDate = new Date(item.loginTime);
      return loginDate >= new Date(fromDate) && loginDate <= new Date(toDate);
    });

    setLoginData(filtered);
  };

  // Search by User Name
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredData = exampleData.filter(item =>
      item.userName.toLowerCase().includes(term)
    );
    setLoginData(filteredData);
  };

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'Sr.', width: 90, renderCell: (params) => params.api.getRowIndex(params.row.userId) + 1 },
    { field: 'userId', headerName: 'USER ID', width: 150 },
    { field: 'userName', headerName: 'USER NAME', width: 150 },
    { field: 'loginTime', headerName: 'LOGIN TIME', width: 180 },
    { field: 'logoutTime', headerName: 'LOGOUT TIME', width: 180 },
    { field: 'totalTime', headerName: '	TOTAL TIME', width: 150 },
    { field: 'status', headerName: 'STATUS', width: 150 },
  ];

  return (
    <div className="login-report">
      <Typography variant="h4" gutterBottom style={{ color: '#5e6266', fontWeight: 'bold', fontSize: '24px' }}>
        USER LOGIN AND LOGOUT STATUS
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} className="filter-section">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by User Name"
            variant="outlined"
            onChange={handleSearch}
            value={searchTerm}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            onChange={e => setFilterDate({ ...filterDate, fromDate: e.target.value })}
            value={filterDate.fromDate}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            onChange={e => setFilterDate({ ...filterDate, toDate: e.target.value })}
            value={filterDate.toDate}
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

      {/* DataGrid Section */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={loginData.map((item, index) => ({ ...item, id: item.userId }))}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default LoginReport;
