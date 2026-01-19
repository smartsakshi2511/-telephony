import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { CompaignColumn } from "../../datatablesource";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import SearchBar from "../../context/searchBar";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";
import { AuthContext } from "../../context/authContext";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import ViewDialog from "../../components/CampaignComp/ViewCampaign";
import IVRDialog from "../../components/CampaignComp/IVRDialog";
const EditDialog = React.lazy(() =>
  import("../../components/CampaignComp/EditCampaign")
);

const CompaignPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ivrDialogOpen, setIvrDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const basePath =
    user?.user_type === "9"
      ? "superadmin"
      : user?.user_type === "8"
      ? "admin"
      : user?.user_type === "7"
      ? "manager"
      : "admin";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
        const response = await axios.get(
          `https://${window.location.hostname}:4000/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the campaign.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "No authentication token found. Please log in.",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            return;
          }

          await axios.delete(
            `https://${window.location.hostname}:4000/campaigns/deleteCampaign/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData((prevData) => {
            const updated = prevData.filter((item) => item.id !== id);
            return updated;
          });

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "The campaign has been deleted.",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error("Error deleting campaign:", error);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Failed to delete the campaign.",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    });
  };

  const handleEdit = (id) => {
    setEditRowId(id);
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
    const currentItem = data.find((item) => item.id === id);
    const currentStatus = currentItem.status;

    const newStatus = currentStatus === "Y" ? "inactive" : "active";

    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, status: newStatus === "active" ? "Y" : "N" }
          : item
      )
    );

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://${window.location.hostname}:4000/campaigns/statusCompaign/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterChange = (filterOption) => {
    setFilter(filterOption);
    setAnchorEl(null);
  };

  const filteredData = data.filter((item) => {
    if (filter === "active" && item.status !== "active") return false;
    if (!searchQuery) return true;

    const search = searchQuery.toLowerCase();

    return (
      item.compaign_id?.toString().toLowerCase().includes(search) ||
      item.compaignname?.toLowerCase().includes(search) ||
      item.status?.toLowerCase().includes(search) ||
      item.campaign_number?.toString().toLowerCase().includes(search) ||
      item.outbond_cli?.toString().toLowerCase().includes(search) ||
      item.local_call_time?.toLowerCase().includes(search) ||
      item.week_off?.toLowerCase().includes(search)
    );
  });

  const columns = CompaignColumn.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "STATUS",
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isActive = params.row.status === "Y"; // ← compare to 'Y'
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
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;
        const ivrValue = params.row.ivr;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <IconButton
                  color="primary"
                  onClick={() => setEditRowId(params.row.id)}
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
                  gap: "8px",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => handleView(params.row)}
                  style={{
                    padding: "4px",
                    border: "2px solid blue",
                    borderRadius: "6px",
                    backgroundColor: "white",
                  }}
                >
                  <Tooltip title="View">
                    <VisibilityIcon
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    />
                  </Tooltip>
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => handleEdit(params.row.id)}
                  style={{
                    padding: "4px",
                    border: "2px solid green",
                    borderRadius: "6px",
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
                  onClick={() => handleDelete(params.row.compaign_id)}
                  style={{
                    padding: "4px",
                    border: "2px solid red",
                    borderRadius: "6px",
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
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedCampaign(params.row);
                    setIvrDialogOpen(true);
                  }}
                  style={{
                    padding: "4px",
                    border: "2px solid #1976d2",
                    borderRadius: "6px",
                    backgroundColor: "white",
                  }}
                >
                  <Tooltip title="Manage IVRs">
                    <VolumeOffIcon
                      style={{
                        cursor: "pointer",
                        color: "#1976d2",
                        fontSize: "12px",
                      }}
                    />
                  </Tooltip>
                </IconButton>{" "}
                {ivrValue === 1 || ivrValue === "1" ? (
                  <Tooltip title="IVR Group">
                    <IconButton
                      onClick={() => navigate(`/${basePath}/extension`)}
                      style={{
                        padding: "4px",
                        border: "2px solid orange",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                    >
                      <GroupIcon
                        style={{
                          color: "orange",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div
        className="datatableTitle"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <b>CAMPAIGN LIST</b>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchBar
              onSearch={(value) => setSearchQuery(value)}
              placeholder="Search Campaign ID, Name, Status, CID, Week Off etc."
            />
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

            <Button
              className="addButton"
              startIcon={<AddIcon />}
              component={Link}
              to={`/${basePath}/newCampaign`}
              sx={{
                background: "linear-gradient(90deg, #283593, #3F51B5)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg, #1e276b, #32408f)",
                },
              }}
            >
              Add CAMPAIGN
            </Button>
          </div>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        style={{ fontSize: "12px" }}
        getRowId={(row) => row.compaign_id}
        autoHeight
      />
      {editRowId && (
        <EditDialog
          open={Boolean(editRowId)}
          onClose={(updatedData) => {
            if (updatedData) {
              setData((prevData) =>
                prevData.map((item) =>
                  item.id === updatedData.id ? updatedData : item
                )
              );
            }
            setEditRowId(null);
          }}
          onSave={(updatedData) => {
            setData((prevData) =>
              prevData.map((item) =>
                item.id === updatedData.id ? updatedData : item
              )
            );
          }}
          data={data.find((item) => item.id === editRowId)}
        />
      )}
      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />
      <IVRDialog
        open={ivrDialogOpen}
        onClose={(refresh) => {
          setIvrDialogOpen(false);
          setSelectedCampaign(null);
          // if (refresh) window.location.reload();  
        }}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default CompaignPage;
