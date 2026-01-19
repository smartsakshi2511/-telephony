import "./list.scss";
import {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { AuthContext } from "../../context/authContext";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Tooltip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import BlockIcon from "@mui/icons-material/Block";
import { PopupContext } from "../../context/iframeContext";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import Swal from "sweetalert2";
import "./callReportList.scss";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import GridViewIcon from "@mui/icons-material/GridView";
import FilterListIcon from "@mui/icons-material/FilterList";
import JSZip from "jszip";
import { maskNumber, clickToCall, blockNumber } from "../../context/Phoneutils";
import SearchBar from "../../context/searchBar";
const RecordingPlayer = lazy(() => import("../../context/Call_Recording"));

const CallReportList = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [page, setPage] = useState(0);
  const [recordingPermission, setRecordingPermission] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleFilterSubmit = () => {
    const filtered = data.filter((call) => {
      if (!call.start_time) return false;

      const fixedStartTime = call.start_time.replace(
        /^(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2}:\d{2})$/,
        "$1 $2"
      );

      const callDateObj = new Date(fixedStartTime);
      if (isNaN(callDateObj)) return false; // agar invalid hai to skip

      const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
      const to = toDate ? new Date(toDate + "T23:59:59") : null;

      return (
        (!from || callDateObj >= from) &&
        (!to || callDateObj <= to) &&
        (!selectedAgent || call.did?.toString() === selectedAgent.toString())
      );
    });

    setFilteredData(filtered);
    setFilterDialogOpen(false);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${window.location.hostname}:4000/call_report_agent_dropdown`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAgents(res.data); // [{user_id, full_name}, ...]
      } catch (err) {
        console.error("❌ Error fetching agents:", err);
      }
    };

    fetchAgents();
  }, []);

  const handleDownloadRecordings = async (all = false) => {
    const zip = new JSZip();
    const token = localStorage.getItem("token");

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const recordsToDownload = all
      ? filteredData
      : filteredData.slice(startIndex, endIndex);

    const recordings = recordsToDownload.filter((item) => item.record_url);

    if (recordings.length === 0) {
      Swal.fire("No recordings to download.");
      return;
    }

    const folder = zip.folder("recordings");

    await Promise.all(
      recordings.map(async (item, index) => {
        try {
          const response = await fetch(item.record_url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const blob = await response.blob();
          const name = `recording_${index + 1}_${item.did || "unknown"}.mp3`;
          folder.file(name, blob);
        } catch (error) {
          console.error("Failed to fetch recording:", item.record_url, error);
        }
      })
    );

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `recordings_${all ? "all" : `page_${page + 1}`}.zip`);
      Swal.fire(
        "Download Ready",
        "Your recordings ZIP file is downloading.",
        "success"
      );
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "sr",
        headerName: "SR",
        flex: 0.5,
        valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
      },

      { field: "did", headerName: "Agent ID", flex: 1 },
      {
        field: "call_from",
        headerName: "Call From",
        flex: 2.0,
        renderCell: (params) => (
          <div>
            {maskNumber(params.value)}

            {params.row.direction === "inbound" && params.value && (
              <>
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
                    <PhoneIcon className="phoneIcon" />
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
                    <BlockIcon className="blockIcon" />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </div>
        ),
      },
      {
        field: "call_to",
        headerName: "Call To",
        flex: 1.5,
        renderCell: (params) => (
          <div>
            {maskNumber(params.value)}

            {params.row.direction === "outbound" && params.value && (
              <>
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
                    <PhoneIcon className="phoneIcon" />
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
                    <BlockIcon className="blockIcon" />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </div>
        ),
      },
      { field: "start_time", headerName: "Start Time", flex: 1.5 },
      { field: "dur", headerName: "Duration", flex: 1 },
      { field: "direction", headerName: "Direction", flex: 1 },
      { field: "status", headerName: "Status", flex: 1 },
      { field: "hangup", headerName: "Hangup", flex: 1 },
      { field: "campaign_id", headerName: "Campaign", flex: 1 },
      {
        field: "record_url",
        headerName: "Recording",
        flex: 1,
        renderCell: (params) => {
          const utype = user?.user_type;
          const hasAccess =
            utype == 9 || utype == 8 || params.row.recording_permission === 1;

          return hasAccess ? (
            <Suspense fallback={<CircularProgress size={20} />}>
              <RecordingPlayer url={params.value} />
            </Suspense>
          ) : (
            <span style={{ color: "gray" }}>No Access</span>
          );
        },
      },
    ],
    []
  );
  const handleDownloadAll = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }
    const excelData = filteredData.map((item) => ({
      "Admin Name": item.admin,
      DID: item.did,
      "Call From": item.call_from,
      "Call To": item.call_to,
      "Campaign ID": item.campaign_id,
      "Start Time": item.start_time,
      "End Time": item.end_time,
      Duration: item.dur,
      Direction: item.direction,
      Status: item.status,
      Hangup: item.hangup,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `call_data_all.xlsx`);

    Swal.fire({
      icon: "success",
      title: `${filteredData.length} records exported successfully.`,
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
    });
  };
  const fetchCampaigns = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/viewCalls`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(response.data);
      setFilteredData(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("An error occurred while fetching campaigns.");
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${window.location.hostname}:4000/user/${user.user_id}/recording`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecordingPermission(res.data.recording_permission === 1);
      } catch (err) {
        console.error("Permission fetch error:", err);
      }
    };
    fetchPermission();
  }, [user.user_id]);

  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const excelData = currentPageData.map((item) => ({
      "Admin Name": item.admin,
      DID: item.did,
      "Call From": item.call_from,
      "Call To": item.call_to,
      "Campaign ID": item.campaign_id,
      "Start Time": item.start_time,
      "End Time": item.end_time,
      Duration: item.dur,
      Direction: item.direction,
      Status: item.status,
      Hangup: item.hangup,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `call_data_page_${page + 1}.xlsx`);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "success",
      title: `${currentPageData.length} records exported from page ${
        page + 1
      }.`,
    });
  };
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>TOTAL CALL REPORTS</b>
        <div className="callFilter">
          <SearchBar
            onSearch={(val) => setSearchQuery(val)}
            placeholder="Search call reports..."
          />

          <Tooltip title="Filter by Date">
            <IconButton
              onClick={() => setFilterDialogOpen(true)}
              style={{ marginRight: "10px" }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export Options">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                background: "linear-gradient(90deg, #1976d2, #0d47a1)",
                color: "white",
                boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                borderRadius: "10px",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #08306b)",
                },
              }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 4,
              sx: { borderRadius: 2, mt: 1, minWidth: 240 },
            }}
          >
            <MenuItem
              onClick={() => {
                handleDownloadAll();
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <GridViewIcon fontSize="small" />
              </ListItemIcon>
              Export All Data
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDownload();
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <GridViewIcon fontSize="small" />
              </ListItemIcon>
              Export Filtered Data
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDownloadRecordings(false);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <AudioFileIcon fontSize="small" />
              </ListItemIcon>
              Filtered Recordings
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDownloadRecordings(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <AudioFileIcon fontSize="small" />
              </ListItemIcon>
              All Recordings
            </MenuItem>
          </Menu>

          {/* </>
          )} */}
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData}
        columns={columns}
        pageSize={pageSize}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // onPageChange={(newPage) => setPage(newPage)}
      />

      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
      >
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
            onClick={handleFilterSubmit}
            color="primary"
            variant="contained"
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CallReportList;
