import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { CompaignColumn, compaignRows } from "../../datatablesource";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import axios from "axios";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import DeleteAction from "../../components/CampaignComp/DeleteCampaign";
import ViewDialog from "../../components/CampaignComp/ViewCampaign";
import EditDialog from "../../components/CampaignComp/EditCampaign";
import "./Compaignpage.scss";

const CompaignPage = () => {
  const [data, setData] = useState(compaignRows);
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [filter, setFilter] = useState("all"); // For filtering data
  const [anchorEl, setAnchorEl] = useState(null); // For the filter menu

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

  const handleEdit = (id) => {
    setEditRowId(id);
  };

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
          prevData.map((item) =>
            item.id === updatedRow.id ? updatedRow : item
          )
        );
        setEditRowId(null);
        Swal.fire("Updated!", "The campaign has been updated.", "success");
      }
    });
  };

  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedCampaign = data.find((item) => item.id === id);
      const newStatus =
        updatedCampaign.status === "active" ? "inactive" : "active";

      await axios.put(`https://api.example.com/campaigns/${id}`, {
        status: newStatus,
      });

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterChange = (filterOption) => {
    setFilter(filterOption);
    setAnchorEl(null);
  };

  const filteredData =
    filter === "active"
      ? data.filter((item) => item.status === "active")
      : data;

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
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateEdit(params.row)}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton color="" onClick={() => setEditRowId(null)}>
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px", // Adjust spacing between buttons
              }}
            >
              <IconButton
                color="primary"
                onClick={() => handleView(params.row)}
                style={{
                  padding: "4px",
                  border: "2px solid blue", // Border matching icon color
                  borderRadius: "6px 6px", // Circular border
                  backgroundColor: "white", // White background
                }}
              >
                 <Tooltip title="View">
                <VisibilityIcon
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    fontSize: "12px", // Adjust icon size
                  }}
                />
                </Tooltip>
              </IconButton>

              <IconButton
                color="info"
                onClick={() => handleEdit(params.row.id)}
                style={{
                  padding: "4px",
                  border: "2px solid green", // Border matching icon color
                  borderRadius: "6px 6px",
                  backgroundColor: "white",
                }}
              >
                 <Tooltip title="Edit">
                <EditIcon
                  style={{
                    cursor: "pointer",
                    color: "green",
                    fontSize: "12px",
                  }}
                />
                 </Tooltip>
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(params.row.id)}
                style={{
                  padding: "4px",
                  border: "2px solid red", // Border matching icon color
                  borderRadius: "6px 6px",
                  backgroundColor: "white",
                }}
              >
                <Tooltip title="Delete">
                <DeleteIcon
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "12px",
                  }}
                />
                </Tooltip>
              </IconButton>
            </div>
            
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      
      <div className="datatableTitle">
        <b>CAMPAIGN LIST</b>
        <Button
  variant="contained"
  color="primary"
  startIcon={<AddIcon />}
  component={Link}
  to="/campaign/newCampaign"
  sx={{
    background: "linear-gradient(90deg, #283593, #3F51B5)",
    color: "#fff",
    marginLeft: "600px",
    "&:hover": {
      background: "linear-gradient(90deg, #1e276b, #32408f)",
    },
    // Media query for responsiveness
    "@media (max-width: 600px)": {
      fontSize: "12px", // Adjust font size
      padding: "6px 12px", // Adjust padding
      marginLeft: "0", // Center or reposition the button
      width: "100%", // Full width for small screens
    },
    "@media (max-width: 960px)": {
      marginLeft: "auto", // Center the button on medium screens
      marginRight: "auto",
    },
  }}
>
  Add CAMPAIGN
</Button>

        <IconButton onClick={handleFilterClick}>
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleFilterChange("all")}>All</MenuItem>
          <MenuItem onClick={() => handleFilterChange("active")}>
            Active
          </MenuItem>
        </Menu>
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        style={{ fontSize: "12px" }}
      />
      {editRowId && (
        <EditDialog
          open={Boolean(editRowId)}
          onClose={() => setEditRowId(null)}
          data={data.find((item) => item.id === editRowId)}
          onSave={handleUpdateEdit}
        />
      )}
      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />
    </div>
  );
};

export default CompaignPage;
