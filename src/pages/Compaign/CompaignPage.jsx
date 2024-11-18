// src/pages/CompaignPage/CompaignPage.jsx

import "./Compaignpage.scss";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2"; // Import SweetAlert2
import { CompaignColumn, compaignRows } from "../../datatablesource";
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import axios from "axios";
import { IconButton,  Tooltip } from "@mui/material";
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
  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
    // Optionally, make an API call to delete the campaign
    // axios.delete(`https://api.example.com/campaigns/${id}`)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error deleting campaign:", error); });
  // };



  // Handle Delete with SweetAlert confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the block.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The block has been deleted.", "success");
      }
    });
  };

  // Handle Edit
  const handleEdit = (id) => {
    setEditRowId(id);
  };

 // Updated handleUpdateEdit with SweetAlert confirmation
const handleUpdateEdit = (updatedRow) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to save the changes?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, update it!",
  }).then((result) => {
    if (result.isConfirmed) {
      setData((prevData) =>
        prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item))
      );
      setEditRowId(null); // Exit edit mode after saving

      Swal.fire("Updated!", "The campaign has been updated.", "success");
    }
  });
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
      headerName: "ACTION",
      width: 180,
      headerClassName: "customHeader",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <Tooltip title="Update">
                  <IconButton
                    color="primary"
                    onClick={() => handleUpdateEdit(params.row)} >
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

  const handleToggleStatus = async (id) => {
    try {
      const updatedCampaign = data.find((item) => item.id === id);
      const newStatus = updatedCampaign.status === "active" ? "inactive" : "active";
      
      // Make an API call to update the status on the server
      await axios.put(`https://api.example.com/campaigns/${id}`, {
        status: newStatus,
      });
    
      // Update the state to reflect the new status
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
  
  // Modify columns to allow colored spans for status
  const columns = CompaignColumn.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "STATUS",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isActive = params.row.status === "active";
          return (
            <button
              className={`statusButton ${isActive ? "active" : "inactive"}`}
              onClick={() => handleToggleStatus(params.row.id)}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          );
        },
      };
    }
    return col;
  });



  return (
    <div className="datatable">
      <div className="datatableTitle">
      CAMPAIGN LIST
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/campaign/newCampaign"
        >
          Add CAMPAIGN
        </Button>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        
        style={{ fontSize: '12px' }}
      />

      {/* Edit Dialog */}
      {editRowId && (
        <EditDialog
          open={Boolean(editRowId)}
          onClose={() => setEditRowId(null)}
          data={data.find((item) => item.id === editRowId)}
          onSave={handleUpdateEdit}
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
