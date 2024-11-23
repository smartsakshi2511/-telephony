import React, { useState } from "react";
import "./list.scss";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Mock data
const initialExtensions = [
  { id: 1, userExtension: "1001", extensionName: "John Doe", pressKey: "1", campaign: "Sales" },
  { id: 2, userExtension: "1002", extensionName: "Jane Smith", pressKey: "2", campaign: "Support" },
];

const campaignOptions = [
  { id: "sales", label: "Sales" },
  { id: "support", label: "Support" },
  { id: "marketing", label: "Marketing" },
];

const agentsList = [
  { id: 1, name: "Agent 1", agentId: "A101" },
  { id: 2, name: "Agent 2", agentId: "A102" },
];

const ExtensionList = () => {
  const [data, setData] = useState(initialExtensions);
  const [editRowId, setEditRowId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      }
    });
  };

  const handleAdd = (newExtension) => {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    setData([...data, { id: newId, ...newExtension }]);
    setAddDialogOpen(false);
  };

  const handleEdit = (id) => {
    setEditRowId(id);
  };

  const handleSaveEdit = (updatedRow) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
    setEditRowId(null);
  };

  const columns = [
    { field: "userExtension", headerName: "USER Extension", width: 150 },
    { field: "extensionName", headerName: "Extension NAME", width: 200 },
    { field: "pressKey", headerName: "PRESS KEY", width: 150 },
    { field: "campaign", headerName: "CAMPAIGN", width: 150 },
    {
      field: "action",
      headerName: "ACTION",
      width: 250,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;
        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <Tooltip title="Save">
                  <IconButton
                    color="primary"
                    onClick={() => handleSaveEdit(params.row)}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    color="secondary"
                    onClick={() => setEditRowId(null)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit">
                  <IconButton color="info" onClick={() => handleEdit(params.row.id)}>
                    <EditIcon style={{ cursor: "pointer", color: "green" }}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon style={{ cursor: "pointer", color: "red" }}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Assign Department to Agents">
                  <IconButton
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <img
                      src="../assets/images/common-icons/addclint.png"
                      alt="assign_department"
                      style={{ height: 23, width: 23, cursor: "pointer", color: "primary"}}
                      className="shadow-sm best_font cursor_p"
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Review Assigned Departments">
                  <IconButton
                    color="secondary"
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    <GroupIcon  style={{ cursor: "pointer", color: "secondary" }}/>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
       <b> EXTENSION LIST </b>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)",
            },
          }}
        >
          Add Extension
        </Button>
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        style={{ fontSize: "12px" }}
      />
      {dropdownVisible && (
        <Box
          className="dropdown-menu show"
          sx={{
            position: "absolute",
            overflow: "scroll",
            height: 200,
            width: "auto",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 1000,
          }}
        >
          <table>
            <thead>
              <tr>
                <th></th>
                <th className="text-primary">Agent Name</th>
                <th className="text-primary">Agent ID</th>
              </tr>
            </thead>
            <tbody>
              {agentsList.map((agent) => (
                <tr key={agent.id}>
                  <td>
                    <input type="checkbox" value={agent.id} className="cursor-p agent mr-2" />
                  </td>
                  <td>{agent.name}</td>
                  <td>{agent.agentId}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <button className="btn btn-md btn-primary shadow-sm best_font">
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      )}
      {addDialogOpen && (
        <AddDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onAdd={handleAdd}
        />
      )}
      {reviewDialogOpen && (
        <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}>
          <DialogTitle>Review Assigned Departments</DialogTitle>
          <DialogContent>
            <Typography>Display department assignments here...</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

const AddDialog = ({ open, onClose, onAdd }) => {
  const [newExtension, setNewExtension] = useState({
    userExtension: "",
    extensionName: "",
    pressKey: "",
    campaign: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExtension((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      newExtension.userExtension &&
      newExtension.extensionName &&
      newExtension.pressKey &&
      newExtension.campaign
    ) {
      onAdd(newExtension);
      setNewExtension({
        userExtension: "",
        extensionName: "",
        pressKey: "",
        campaign: "",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Extension</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="userExtension"
          label="USER Extension"
          fullWidth
          variant="outlined"
          value={newExtension.userExtension}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="extensionName"
          label="Extension NAME"
          fullWidth
          variant="outlined"
          value={newExtension.extensionName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="pressKey"
          label="PRESS KEY"
          fullWidth
          variant="outlined"
          value={newExtension.pressKey}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="campaign"
          label="CAMPAIGN"
          fullWidth
          variant="outlined"
          select
          value={newExtension.campaign}
          onChange={handleChange}
        >
          {campaignOptions.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionList;
