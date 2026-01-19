import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PhoneIcon from "@mui/icons-material/Phone";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { maskNumber, clickToCall } from "../../context/Phoneutils";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";
 
const createColumns = (user, updateIframeSrc, toggleIframe) => [
  { field: "id", headerName: "SR", flex: 0.5 },
  { field: "upload_user", headerName: "AGENT ID", flex: 0.7 },
  { field: "name", headerName: "CALLER NAME", flex: 1 },
  {
    field: "phone_number",
    headerName: "CALLER NUMBER",
    flex: 1.5,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "6px" }}>{maskNumber(params.value)}</span>
        {params.value && (
          <Tooltip title="Click to Call">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                clickToCall({
                  number: params.value,
                  user,
                  updateIframeSrc,
                  toggleIframe,
                })
              }
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
  { field: "email", headerName: "EMAIL", flex: 1.5 },
  { field: "dialstatus", headerName: "DIAL STATUS", flex: 1 },
  { field: "remark", headerName: "REMARK", flex: 2 },
  { field: "date", headerName: "DATE", flex: 1.5 },
];

const LeadReportList = () => {
  const { user } = useContext(AuthContext);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Memoize columns so they don’t rebuild every render
  const columns = useMemo(
    () => createColumns(user, updateIframeSrc, toggleIframe),
    [user, updateIframeSrc, toggleIframe]
  );

  // ✅ Fetch Leads and Agents in parallel
const fetchLeadsAndAgents = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const leadsRes = await axios.get(
      `https://${window.location.hostname}:4000/viewLeadReport`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const formatted = leadsRes.data.map((item) => ({
      ...item,
      date: item.date
        ? dayjs(item.date).format("DD-MM-YYYY HH:mm:ss")
        : "",
    }));

    setData(formatted);

    // 👇 agent dropdown sirf admin / manager ke liye
    if (user?.userType !== 1) {
      const agentsRes = await axios.get(
        `https://${window.location.hostname}:4000/call_report_agent_dropdown`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgents(agentsRes.data);
    }

    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
  }
}, [user]);


  useEffect(() => {
    fetchLeadsAndAgents();
  }, [fetchLeadsAndAgents]);

  // ✅ useMemo for filtering (search + filter)
  const filteredData = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return data.filter((call) => {
      const matchSearch = Object.values(call).some(
        (value) => value && value.toString().toLowerCase().includes(lower)
      );

      const [day, month, year, hour, min, sec] =
        call.date?.match(/(\d+)/g) || [];
      if (!day) return false;

      const callDateObj = new Date(
        `${year}-${month}-${day}T${hour}:${min}:${sec}`
      );
      const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
      const to = toDate ? new Date(toDate + "T23:59:59") : null;

      const matchDate =
        (!from || callDateObj >= from) && (!to || callDateObj <= to);
      const matchAgent =
        !selectedAgent ||
        call.upload_user?.toString() === selectedAgent.toString();

      return matchSearch && matchDate && matchAgent;
    });
  }, [data, searchQuery, fromDate, toDate, selectedAgent]);

  // ✅ useMemo for paginated rows (reduces recalculations)
  const paginatedRows = useMemo(() => {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData
      .slice(startIndex, endIndex)
      .map((row, i) => ({ ...row, id: startIndex + i + 1 }));
  }, [filteredData, page, pageSize]); 

  const handleDownload = useCallback(async () => {
    if (filteredData.length === 0) {
      Swal.fire("No Data", "No data available to export.", "warning");
      return;
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const excelData = currentPageData.map((item, index) => ({
      SR: startIndex + index + 1,
      "AGENT ID": item.upload_user,
      "CALLER NAME": item.name,
      "CALLER NUMBER": item.phone_number,
      EMAIL: item.email,
      REMARK: item.remark,
      "DIAL STATUS": item.dialstatus,
      DATE: item.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `lead_data_page_${page + 1}.xlsx`);

    Swal.fire({
      icon: "success",
      title: `${currentPageData.length} records exported`,
      timer: 2000,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
    });
  }, [filteredData, page, pageSize]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>TOTAL LEAD REPORTS</b>
        <div className="callFilter">
          <Tooltip title="Search">
            <IconButton
              onClick={() => setShowSearch((prev) => !prev)}
              sx={{ mr: 1 }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {showSearch && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 1 }}
            />
          )}

          <Tooltip title="Filter by Date">
            <IconButton
              onClick={() => setFilterDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download Data">
            <Button
              variant="outlined"
              onClick={handleDownload}
              sx={{ background: "#4caf50", color: "white" }}
            >
              Export
              <DownloadIcon />
            </Button>
          </Tooltip>
        </div>
      </div>

      <PaginatedGrid
        rows={paginatedRows}
        columns={columns}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      /> 
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
      >
        <DialogTitle>Filter Lead Records</DialogTitle>
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

          <TextField
            select
            label="Select Agent"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">All Agents</MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent.user_id} value={agent.user_id}>
                {agent.user_id}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            color="primary"
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeadReportList;
