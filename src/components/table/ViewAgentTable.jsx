import React, { useState, useEffect } from "react";
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
import { Link, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import "./table.scss";

const ListView = ({ user_id }) => {
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  // const { user_id } = useParams();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`https://${window.location.hostname}:4000/telephony/Agent-Summary/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newRows = reorder(rows, result.source.index, result.destination.index);
    setRows(newRows);
  };

  const filteredRows = rows.filter((row) => {
    const matchesDate =
      dateFilter === "All" || (dateFilter === "Today" && row.lastCall.includes("min"));
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="listHeader">
        <div className="listTitle">
          <Link to="/table" style={{ textDecoration: "none", color: "inherit" }}>
            Agent Summary
          </Link>
        </div>
        <div className="dropdowns">
          <Select
            className="dropdown"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Today">Today</MenuItem>
          </Select>
          <Select
            className="dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell>Call From</TableCell>
                    <TableCell>Call To</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Direction</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Audio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => {
                    return (
                      <Draggable
                        key={row.id}
                        draggableId={row.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>{row.admin}</TableCell>
                            <TableCell>{row.call_from}</TableCell>
                            <TableCell>{row.call_to}</TableCell>
                            <TableCell>{row.start_time}</TableCell>
                            <TableCell>{row.dur}</TableCell>
                            <TableCell>{row.direction}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.record_url}</TableCell>
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
    </div>
  );
};

export default ListView;
