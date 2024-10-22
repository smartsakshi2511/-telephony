// src/pages/CompaignPage/CompaignPage.jsx

import "./Compaignpage.scss";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CompaignColumn, compaignRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import axios from "axios";
import { IconButton, Switch, Tooltip } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

// Import the new components
import DeleteAction from "../../components/CampaignComp/DeleteCampaign";
import ViewDialog from "../../components/CampaignComp/ViewCampaign";
import EditDialog from "../../components/CampaignComp/EditCampaign";

const CompaignPage = () => {
  const [data, setData] = useState(compaignRows);
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Handle Delete
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    // Optionally, make an API call to delete the campaign
    // axios.delete(`https://api.example.com/campaigns/${id}`)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error deleting campaign:", error); });
  };

  // Handle Edit
  const handleEdit = (id) => {
    setEditRowId(id);
  };

  const handleSaveEdit = (updatedRow) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
    setEditRowId(null); // Exit edit mode after saving
  };

  // Handle Status Toggle
  const handleToggleStatus = async (id) => {
    try {
      const updatedCampaign = data.find((item) => item.id === id);
      const newStatus =
        updatedCampaign.status === "active" ? "deactive" : "active";
      // Make an API call to update the status
      await axios.put(`https://api.example.com/campaigns/${id}`, {
        status: newStatus,
      });
      // Update the state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Optionally, show a notification to the user
    }
  };

  // Handle View
  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  // Define the action column with icons
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <Tooltip title="Save">
                  <IconButton
                    color="primary"
                    onClick={() => handleSaveEdit(params.row)} >
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
                <Tooltip title="View">
                  <IconButton
                    color="primary"
                    onClick={() => handleView(params.row)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    color="info"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Modify columns to allow editable cells
  const columns = CompaignColumn.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "Status",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Switch
              checked={params.row.status === "active"}
              onChange={() => handleToggleStatus(params.row.id)}
              color="primary"
              name="status"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          );
        },
      };
    }
    return col;
  });

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Campaign
        <Link to="/campaign/newCampaign" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

      {/* Edit Dialog */}
      {editRowId && (
        <EditDialog
          open={Boolean(editRowId)}
          onClose={() => setEditRowId(null)}
          data={data.find((item) => item.id === editRowId)}
          onSave={handleSaveEdit}
        />
      )}

      {/* View Dialog */}
      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />
    </div>
  );
};

export default CompaignPage;
