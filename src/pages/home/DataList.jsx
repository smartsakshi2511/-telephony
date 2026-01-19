import { useEffect, useState, useContext, useRef, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import BackButton from "../../context/BackButton";
import axios from "axios";
import Phone from "../../components/navbar/PhoneCall";
import Swal from "sweetalert2"; // at the top if not already
import "./home.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import PhoneIcon from "@mui/icons-material/Phone";
import BlockIcon from "@mui/icons-material/Block";
import { PopupContext } from "../../context/iframeContext";
const RecordingPlayer = lazy(() => import("../../context/Call_Recording"));
const DataList = () => {
  const { type } = useParams();
  const { popupState, toggleIframe } = useContext(PopupContext);
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token is missing.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `https://${window.location.hostname}:4000/data/${type}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data.data);
        setTotalItems(response.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [type, page, pageSize]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Authorization token is missing.", "error");
        return;
      }

      let allData = [];
      let currentPage = 1;
      const pageSize = 100; 
      let totalFetched = 0;

      do {
        const response = await axios.get(
          `https://${window.location.hostname}:4000/data/${type}?page=${currentPage}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pageData = response.data.data;
        allData = [...allData, ...pageData];
        totalFetched += pageData.length;

        if (totalFetched >= response.data.totalItems) break;

        currentPage++;
      } while (true);

      if (allData.length === 0) {
        Swal.fire("Warning", "No data available to export.", "warning");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, `${type}_data.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export data.", "error");
    }
  };

  let iframeSrc = "";
  if (user?.user_type === "8") iframeSrc = "/admin/softphone/Phone/index.html";
  else if (user?.user_type === "2")
    iframeSrc = "/team_leader/softphone/Phone/index.html";
  else if (user?.user_type === "1")
    iframeSrc = "/agent/softphone/Phone/index.html";

  const handleClickToCall = (number) => {
    console.log("Initiating call to:", number);
    toggleIframe("phone");
  };

  const handleBlockNumber = async (number) => {
    const ins_date = new Date().toISOString().slice(0, 19).replace("T", " "); // Format date
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post(
        `https://${window.location.hostname}:4000/addBlock`,
        { block_no: number, ins_date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Number ${number} blocked successfully!`);
      }
    } catch (error) {
      console.error("Error blocking number:", error);
      alert("Failed to block the number.");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <BackButton />
        </div>
        <Typography variant="h5" gutterBottom>
          {type.toUpperCase()}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleExport}
          style={{
            background: "linear-gradient(90deg, #4caf50, #2e7d32)",
            color: "white",
            borderColor: "#4caf50",
          }}
        >
          Export <DownloadIcon />
        </Button>
      </div>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Call From</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hangup</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Recording</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>

                <TableCell>
                  <div>
                    {item.call_from}
                    {item.direction === "inbound" && item.call_from && (
                      <>
                        <IconButton
                          onClick={() => handleClickToCall(item.call_from)}
                          color="primary"
                        >
                          <Tooltip title="Click to Call">
                            <PhoneIcon
                              className="phoneIcon"
                              style={{ fontSize: "15px" }}
                            />
                          </Tooltip>
                        </IconButton>

                        <IconButton
                          onClick={() => handleBlockNumber(item.call_from)}
                          color="secondary"
                        >
                          <Tooltip title="Block Number">
                            <BlockIcon
                              className="blockIcon"
                              style={{ fontSize: "15px" }}
                            />
                          </Tooltip>
                        </IconButton>
                      </>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    {item.did}
                    {item.direction === "outbound" && item.did && (
                      <>
                        <IconButton
                          onClick={() => handleClickToCall(item.did)}
                          color="primary"
                        >
                          <Tooltip title="Click to Call">
                            <PhoneIcon
                              className="phoneIcon"
                              style={{ fontSize: "15px" }}
                            />
                          </Tooltip>
                        </IconButton>

                        <IconButton
                          onClick={() => handleBlockNumber(item.did)}
                          color="secondary"
                        >
                          <Tooltip title="Block Number">
                            <BlockIcon
                              className="blockIcon"
                              style={{ fontSize: "15px" }}
                            />
                          </Tooltip>
                        </IconButton>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.start_time}</TableCell>
                <TableCell>{item.end_time}</TableCell>
                <TableCell>{item.dur}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.hangup}</TableCell>
                <TableCell>{item.direction}</TableCell>
                <TableCell>
                  <Suspense
                    key={item.id}
                    fallback={<CircularProgress size={20} />}
                  >
                    <RecordingPlayer url={item.record_url} id={item.id} />
                  </Suspense>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {popupState.phone && (
        <Phone
          id="phone"
          toggleVisibility={() => toggleIframe("phone")}
          iframeSrc={iframeSrc}
        />
      )}

      <Pagination
        count={Math.ceil(totalItems / pageSize)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default DataList;
