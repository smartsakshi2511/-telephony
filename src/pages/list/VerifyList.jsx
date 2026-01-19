import React, { useEffect, useState , useContext, useCallback } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  MenuItem,
  IconButton,
  Grid,
  Typography
} from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { maskNumber, clickToCall, blockNumber } from "../../context/Phoneutils";
import { PopupContext } from "../../context/iframeContext";
import PhoneIcon from "@mui/icons-material/Phone";
import BlockIcon from "@mui/icons-material/Block";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";



const RecordDialog = ({ open, onClose, row }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle sx={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      Record Details
      <IconButton onClick={onClose} sx={{ color: 'black' }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      <Grid container spacing={2}>
        {[
          { label: "Case Number", value: row.enter_case_number },
          { label: "Name", value: row.name },
          { label: "Mobile", value: row.mobile },
          { label: "Alt Mobile", value: row.alt_mobile },
          { label: "Who Met", value: row.who_met },
          { label: "Documents Shown", value: row.documents_shown },
          { label: "Relation with Applicant", value: row.relation_with_applicant },
          { label: "Existence in Years", value: row.existence_in_years },
          { label: "Owned or Rented", value: row.owned_or_rented },
          { label: "Persons Visited", value: row.persons_visited },
          { label: "FE Behavior", value: row.fe_behavior },
          { label: "Contact Number Asked", value: row.contact_number_asked },
          { label: "Loan Application Elsewhere", value: row.loan_application_elsewhere },
          { label: "Campaign ID", value: row.campaign_id },
          { label: "Submitted At", value: row.submitted_at },
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#555' }}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              {item.value || "-"}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </DialogContent>
  </Dialog>
);

const VerificationReportList = () => {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
    const { user } = useContext(AuthContext);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);


  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/campaigns_dropdown`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Fetched Campaigns:", response.data);

      const options = response.data.map((c) => ({
        id: c.compaign_id,        // API ka field
        label: c.compaignname,   // API ka field
      }));

      setCampaigns([{ id: "", label: "--- Select Campaign ---" }, ...options]);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };


 const fetchVerificationForms = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `https://${window.location.hostname}:4000/viewVerificationForm`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, fromDate, toDate, campaign_id: selectedCampaign },
      }
    );

    const formatted = response.data.data.map((item) => ({
      ...item,
      raw_date: item.submitted_at ? new Date(item.submitted_at) : null, 
      submitted_at: item.submitted_at
        ? dayjs(item.submitted_at).format("DD-MM-YYYY HH:mm")
        : "",
    }));

    setData(formatted);
    setTotal(response.data.total);
  } catch (err) {
    console.error("Error fetching verification forms:", err);
  }
};

  useEffect(() => {
    fetchVerificationForms();
    fetchCampaigns();
  }, [page, limit, fromDate, toDate, selectedCampaign]);

  useEffect(() => {
    const filtered = data.filter((row) =>
      Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const handleDownload = () => {
    const excelData = filteredData.map((item, index) => ({
      SR: (page - 1) * limit + index + 1,
      Name: item.name,
      Mobile: item.mobile,
      "Alt Mobile": item.alt_mobile,
      "Who Met": item.who_met,
      Documents: item.documents_shown,
      Relation: item.relation_with_applicant,
      "Existence (yrs)": item.existence_in_years,
      "Owned/Rented": item.owned_or_rented,
      "Persons Visited": item.persons_visited,
      "FE Behavior": item.fe_behavior,
      "Contact Asked": item.contact_number_asked,
      "Loan Elsewhere": item.loan_application_elsewhere,
      "Case No": item.enter_case_number,
      Campaign: item.campaign_id,
      "Submitted At": item.submitted_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Verification Forms");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `verification_forms_page_${page}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({ icon: "success", title: `${filteredData.length} records exported`, toast: true, timer: 3000, position: "top-end", showConfirmButton: false });
  };


const handleFilterSubmit = () => {
  const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
  const to = toDate ? new Date(toDate + "T23:59:59") : null;

  const filtered = data.filter((call) => {
    if (!call.raw_date) return false;

    return (
      (!from || call.raw_date >= from) &&
      (!to || call.raw_date <= to) &&
      (!selectedCampaign ||
        call.campaign_id?.toString() === selectedCampaign.toString())
    );
  });

  setFilteredData(filtered);
  setFilterDialogOpen(false);
};


  const handleView = (row) => {
    setSelectedRow(row);
    setRecordDialogOpen(true);
  };
 
  const columns = [
    { field: "id", headerName: "SR", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
   {
  field: "mobile",
  headerName: "Mobile",
  flex: 1.5,
  renderCell: (params) => (
    <div>
      {maskNumber(params.value)}

      <IconButton
        onClick={() =>
          clickToCall({
            number: params.value,
            user,
            updateIframeSrc,
            toggleIframe,
          })
        }
        color="primary"
      >
        <Tooltip title="Click to Call">
          <PhoneIcon />
        </Tooltip>
      </IconButton>

      <IconButton
        onClick={() =>
          blockNumber({
            number: params.value,
            blockedNumbers,
            setBlockedNumbers,
          })
        }
        color="secondary"
      >
        <Tooltip title="Block Number">
          <BlockIcon />
        </Tooltip>
      </IconButton>
    </div>
  ),
},
    { field: "persons_visited", headerName: "Visited", flex: 1 },
    { field: "submitted_at", headerName: "Submitted At", flex: 1 },
    { field: "campaign_id", headerName: "Campaign", flex: 1 },
    {
      field: "view",
      headerName: "Action",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="View">
          <IconButton
            color="primary"
            onClick={() => handleView(params.row)}
            style={{ padding: "4px", border: "2px solid blue", borderRadius: "6px", backgroundColor: "white" }}
          >
            <VisibilityIcon style={{ cursor: "pointer", color: "blue", fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>VERIFICATION FORMS</b>
        <div className="callFilter">
          <Tooltip title="Search">
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {showSearch && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginRight: "10px" }}
            />
          )}

          <Tooltip title="Filter">
            <IconButton onClick={() => setFilterDialogOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download">
            <Button variant="contained" color="success" onClick={handleDownload} endIcon={<DownloadIcon />}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData.map((row, index) => ({ ...row, id: index + 1 }))}
        columns={columns}
        page={page}
        setPage={setPage}
        pageSize={limit}
        setPageSize={setLimit}
        rowCount={total}
      />

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filter Verification Forms</DialogTitle>
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
            label="Campaign"
            select
            fullWidth
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            margin="normal"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {campaigns.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {/* {c.label}   */}
                {c.id}
              </MenuItem>
            ))}
          </TextField>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFilterSubmit} color="primary">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Record Dialog */}
      <RecordDialog open={recordDialogOpen} onClose={() => setRecordDialogOpen(false)} row={selectedRow} />
    </div>
  );
};

export default VerificationReportList;
