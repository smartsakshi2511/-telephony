import React, { useState } from "react";
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
import "./table.scss";

// Sample data
const initialRows = [
  {
    id: 1,
    agent: "John Smith",
    status: "Ready",
    lastCall: "2 min ago",
    login: "8:00 AM",
    talk: "5 min",
    cancel: "1",
    other: "0",
    total: "6",
  },
  {
    id: 2,
    agent: "Jane Doe",
    status: "Pause",
    lastCall: "5 min ago",
    login: "8:05 AM",
    talk: "3 min",
    cancel: "0",
    other: "2",
    total: "5",
  },
  {
    id: 3,
    agent: "Michael Brown",
    status: "Ready",
    lastCall: "10 min ago",
    login: "8:10 AM",
    talk: "7 min",
    cancel: "0",
    other: "1",
    total: "8",
  },
  {
    id: 4,
    agent: "Alice Green",
    status: "Ready",
    lastCall: "20 min ago",
    login: "8:15 AM",
    talk: "10 min",
    cancel: "0",
    other: "0",
    total: "10",
  },
];

// Reorder function for drag-and-drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const List = () => {
  const [rows, setRows] = useState(initialRows);
  const [dateFilter, setDateFilter] = useState("All"); // Dropdown for date
  const [statusFilter, setStatusFilter] = useState("All"); // Dropdown for status

  // Handle Drag-and-Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newRows = reorder(
      rows,
      result.source.index,
      result.destination.index
    );
    setRows(newRows);
  };

  // Filter Rows
  const filteredRows = rows.filter((row) => {
    const matchesDate =
      dateFilter === "All" ||
      (dateFilter === "Today" && row.lastCall.includes("min"));
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  return (
    <div>
      <div className="listHeader">
        <div className="listTitle">Agent Summary</div>
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

      {/* Table with Drag-and-Drop */}
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
                    <TableCell>Status</TableCell>
                    <TableCell>Last Call</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>Talk</TableCell>
                    <TableCell>Cancel</TableCell>
                    <TableCell>Other</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => (
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
                          <TableCell>{row.agent}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.lastCall}</TableCell>
                          <TableCell>{row.login}</TableCell>
                          <TableCell>{row.talk}</TableCell>
                          <TableCell>{row.cancel}</TableCell>
                          <TableCell>{row.other}</TableCell>
                          <TableCell>{row.total}</TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
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

export default List;
