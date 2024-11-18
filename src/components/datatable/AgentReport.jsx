import React from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Pagination,
} from '@mui/material';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
 

class AgentReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromDate: '',
            toDate: '',
            page: 1,
            rowsPerPage: 3,
            editRowId: null, // Track which row is being edited
            tempData: {}, // Temporary data during editing
            agentsData: [
                { SR: 1, userId: 8081, userName: '8081', loginTime: '2024-10-15 03:39:25', calls: 0, breaks: 0, breakName: '-', status: 'Logout' },
                { SR: 2, userId: 8081, userName: '8081', loginTime: '2024-10-14 07:19:07', calls: 8, breaks: 0, breakName: '-', status: 'Logout' },
                { SR: 3, userId: 8082, userName: '8082', loginTime: '2024-10-13 08:00:00', calls: 5, breaks: 1, breakName: 'Lunch', status: 'Login' },
                { SR: 4, userId: 8083, userName: '8083', loginTime: '2024-10-12 09:00:00', calls: 10, breaks: 2, breakName: 'Meeting', status: 'Login' },
                { SR: 5, userId: 8084, userName: '8084', loginTime: '2024-10-11 10:00:00', calls: 15, breaks: 1, breakName: 'Break', status: 'Logout' },
                { SR: 6, userId: 8085, userName: '8085', loginTime: '2024-10-10 11:00:00', calls: 20, breaks: 0, breakName: '-', status: 'Logout' },
            ],
        };
    }

    handleDateChange = (setter) => (e) => {
        this.setState({ [setter]: e.target.value });
    };

    handleSearch = () => {
        console.log('Search triggered');
    };

    handleDelete = (id) => {
        this.setState((prevState) => ({
            agentsData: prevState.agentsData.filter((agent) => agent.id !== id),
        }));
    };

    handleEdit = (id) => {
        const rowToEdit = this.state.agentsData.find((agent) => agent.id === id);
        this.setState({
            editRowId: id,
            tempData: { ...rowToEdit },  
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            tempData: { ...prevState.tempData, [name]: value },
        }));
    };

    handleSave = (id) => {
        this.setState((prevState) => ({
            agentsData: prevState.agentsData.map((agent) =>
                agent.id === id ? { ...prevState.tempData } : agent
            ),
            editRowId: null,
            tempData: {},
        }));
    };

    handleCancel = () => {
        this.setState({
            editRowId: null,
            tempData: {},
        });
    };

    changePage = (event, value) => {
        this.setState({ page: value });
    };

    render() {
        const { fromDate, toDate, page, rowsPerPage, editRowId, tempData, agentsData } = this.state;

        // Pie chart data
        const callStats = [
            { name: 'Answer Calls', value: 1234 },
            { name: 'Cancel Calls', value: 123 },
        ];

        const startIndex = (page - 1) * rowsPerPage;
        const paginatedData = agentsData.slice(startIndex, startIndex + rowsPerPage);
        const totalPages = Math.ceil(agentsData.length / rowsPerPage);

        return (
            <div className="agent-report">
                {/* Call Stats and Details Section */}
                <div className="agent-report-section" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Call Statistics */}
                    <div className="call-stats" style={{ flex: '1', minWidth: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Call Statistics</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={callStats} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                                    {callStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Overview */}
                    <div className="total-stats" style={{ flex: '1', minWidth: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Total Call Stats</Typography>
                        <Typography variant="body1">Total calls: 3,835</Typography>
                        <Typography variant="h6" style={{ marginTop: '16px' }}>Total Disposition Stats</Typography>
                        <Typography variant="body1">Answer Calls: 1,234</Typography>
                        <Typography variant="body1">Cancel Calls: 123</Typography>
                    </div>
                </div>
 
                <div className="date-filters" style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <TextField
                        type="date"
                        value={fromDate}
                        onChange={this.handleDateChange('fromDate')}
                        label="From Date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        value={toDate}
                        onChange={this.handleDateChange('toDate')}
                        label="To Date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="contained" onClick={this.handleSearch}>
                        Search
                    </Button>
                    <Button variant="contained" color="success">
                        Export Data
                    </Button>
                </div>

                {/* Login and Logout Details Table */}
                <div className="login-logout-details" style={{ marginTop: '20px' }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        style={{ color: '#5e6266', fontWeight: 'bold', fontSize: '24px' }}
                    >
                        AGENTS LOGIN AND LOGOUT DETAILS
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SR</TableCell>
                                    <TableCell>USER ID</TableCell>
                                    <TableCell>USER NAME</TableCell>
                                    <TableCell>LOGIN TIME</TableCell>
                                    <TableCell>NO. OF CALLS</TableCell>
                                    <TableCell>NO. OF BREAKS</TableCell>
                                    <TableCell>BREAK NAME</TableCell>
                                    <TableCell>STATUS</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell>{agent.id}</TableCell>
                                        <TableCell>
                                            {editRowId === agent.id ? (
                                                <TextField
                                                    name="userId"
                                                    value={tempData.userId || ''}
                                                    onChange={this.handleInputChange}
                                                />
                                            ) : (
                                                agent.userId
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editRowId === agent.id ? (
                                                <TextField
                                                    name="userName"
                                                    value={tempData.userName || ''}
                                                    onChange={this.handleInputChange}
                                                />
                                            ) : (
                                                agent.userName
                                            )}
                                        </TableCell>
                                        <TableCell>{agent.loginTime}</TableCell>
                                        <TableCell>{agent.calls}</TableCell>
                                        <TableCell>{agent.breaks}</TableCell>
                                        <TableCell>{agent.breakName}</TableCell>
                                        <TableCell>{agent.status}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={this.changePage}
                            style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}
                        />
                    </TableContainer>
                </div>
            </div>
        );
    }
}

export default AgentReport;
