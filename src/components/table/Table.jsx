import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import "./table.scss";

const List = () => {
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/agent-summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data) {
        setRows(response.data);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData();
    const interval = setInterval(() => {
      if (isMounted) fetchData();
    }, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (!rows || rows.length === 0) return;
    const newRows = reorder(
      rows,
      result.source.index,
      result.destination.index
    );
    setRows(newRows);
  };

  const filteredRows = rows.filter((row) => {
    const isReady = row.break_status === "2" && row.status === "2";
    const isPause = row.break_status === "2" && row.status === "1";
    const matchesDate =
      dateFilter === "All" ||
      (dateFilter === "Today" && row.lastCall?.includes("min"));
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Ready" && isReady) ||
      (statusFilter === "Pause" && isPause);
    return matchesDate && matchesStatus;
  });

  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const getStatusDetails = (row) => {
    let statusText = "";
    let rowClass = "";
    if (row.break_status === "2" && row.status === "2") {
      statusText = `<span class="text-success">Ready</span>`;
      rowClass = "status-ready";
    } else if (row.break_status == "2" && row.status == "3") {
      statusText =
        row.Calldirection === "inbound"
          ? '<span class="text-blue">Incall/inbound</span>'
          : '<span class="text-purple">Incall/outbound</span>';
      rowClass =
        row.Calldirection === "inbound" ? "status-blue" : "status-purple";
    } else if (row.break_status === "2" && row.status === "1") {
      statusText = `<span class="text-warning">Pause</span>`;
      rowClass = "status-break";
    } else {
      statusText = `<span class="text-danger">Logout</span>`;
      rowClass = "status-logout";
    }
    return { statusText, rowClass };
  };

  return (
    <div>
      <div className="listHeader">
        <div className="listTitle">
          <Link
            to="/admin/table"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Agent Summary
          </Link>
        </div>
        <div className="dropdowns">
          <Select
            className="dropdown"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            displayEmpty
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
            <MenuItem value="Pause">Pause</MenuItem>
          </Select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tableRows">
          {(provided) => (
            <TableContainer
              component={Paper}
              className="table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Table sx={{ minWidth: 650 }} aria-label="agent summary table">
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Call</TableCell>
                    <TableCell>Ready/Pause</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>Talk</TableCell>
                    <TableCell>AutoDial</TableCell>
                    <TableCell>Answer</TableCell>
                    <TableCell>Cancel</TableCell>
                    <TableCell>Other</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {paginatedRows.map((row, index) => {
                    const { statusText, rowClass } = getStatusDetails(row);
                    return (
                      <Draggable
                        key={row.id}
                        draggableId={row.id?.toString() || `draggable-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={rowClass}
                          >
                            <TableCell>{row.user_id}</TableCell>
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: statusText }}
                            />
                            <TableCell>
                              {row.wait_end_time || "00:00:00"}
                            </TableCell>
                            <TableCell>
                              {row.break_status === "2" && row.status === "2"
                                ? "Ready"
                                : row.break_status === "2" && row.status === "1"
                                ? "Pause"
                                : "Logout"}
                            </TableCell>
                            <TableCell>{row.login || "00:00:00"}</TableCell>
                            <TableCell>{row.talk || "00:00:00"}</TableCell>
                            <TableCell>
                              <span
                                style={{
                                  color:
                                    row.auto_dial_on === 1 ? "green" : "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.auto_dial_on === 1 ? "ON" : "OFF"}
                              </span>
                            </TableCell>

                            <TableCell>{row.answer_calls}</TableCell>
                            <TableCell>{row.cancel_calls}</TableCell>
                            <TableCell>{row.other_calls}</TableCell>
                            <TableCell>{row.total_calls}</TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

      {filteredRows.length > 0 && (
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

export default List;
