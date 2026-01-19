import "./list.scss";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";  
import axios from "axios";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import SearchBar from "../../context/searchBar";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const blockColumns = [
   {
    field: "sr",
    headerName: "SR.",
    flex: 0.5,
    valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
  },
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true, 
  },

  {
    field: "block_no",
    headerName: "BLOCK NO",
    flex: 1,
  },
  {
    field: "ins_date",
    headerName: "DATE",
    flex: 1,
    renderCell: (params) => {
      if (!params.value) return "-";

      const date = new Date(params.value);

      const formattedDate = date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",  
      });

      return formattedDate;
    },
  },

  {
    field: "status",
    headerName: "STATUS",
    flex: 0.8,
  },
];

const BlockList = () => {
  const [data, setData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);  
  const [filter, setFilter] = useState("all");  
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

 const fetchBlockList = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const response = await axios.get(
      `https://${window.location.hostname}:4000/block`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(response.data);
    setError("");
  } catch (err) {
    console.error(
      "Error fetching Block List:",
      err.response?.data?.message || err.message
    );
    setError("An error occurred while fetching blocks.");
  }
};

 useEffect(() => {
  fetchBlockList();
}, []);


  const handleDelete = (id) => {
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

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the block.",
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
            Toast.fire({
              icon: "error",
              title: "No authentication token found. Please log in.",
            });
            return;
          }

          const response = await axios.delete(
            `https://${window.location.hostname}:4000/deleteBlock/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setData((prevData) => prevData.filter((item) => item.id !== id));
            Toast.fire({
              icon: "success",
              title: "Block deleted successfully!",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete block. Please try again.",
            });
          }
        } catch (error) {
          console.error("Error deleting block:", error);
          Toast.fire({
            icon: "error",
            title: "An error occurred. Please try again.",
          });
        }
      }
    });
  };

  const handleSaveEdit = (updatedRow) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
    setEditRowId(null);
  };

  const handleToggleStatus = async (blockId, currentStatus) => {
    if (!blockId) {
      console.error("Block ID is undefined");
      return;
    }

    const newStatus = currentStatus === 0 ? 1 : 0;

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/blockStatus`,
        { id: blockId, status: newStatus },  
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setData((prevData) =>
          prevData.map((row) =>
            row.id === blockId ? { ...row, status: newStatus } : row
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleAddBlock = (newBlock) => {
    const isDuplicate = data.some(
      (block) => block.block_no === newBlock.block_no
    );

    if (isDuplicate) {
      return;
    }

    const newId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;

    const blockToAdd = {
      id: newId,
      block_no: newBlock.block_no,
      status: newBlock.status,
      ins_date: newBlock.ins_date,
    };

    setData((prevData) => [...prevData, blockToAdd]);  
    setAddDialogOpen(false);  
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
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
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                    style={{
                      padding: "4px",
                      border: "2px solid red",  
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
              </>
            )}
          </div>
        );
      },
    },
  ];

  const filteredData = data.filter((item) => {
    if (filter === "active" && item.status !== "active") return false;
    if (!searchQuery) return true;
    return item.block_no.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const columns = blockColumns.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "STATUS",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const blockId = params.row?.id;
          const currentStatus = params.row?.status;  
          const isActive = currentStatus === 0;  
          return (
            <button
              className={`statusButton ${isActive ? "active" : "blocked"}`}
              onClick={() => {
                if (blockId !== undefined) {
                  handleToggleStatus(blockId, currentStatus);
                } else {
                  console.error("Block ID is missing!");
                }
              }}
            >
              {isActive ? "Unblocked" : "Blocked"}
            </button>
          );
        },
      };
    }
    return col;
  });

  return (
    <div className="datatable">
      <div
        className="datatableTitle"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <b style={{ fontSize: "1.2rem" }}>BLOCK LIST</b>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search block no..."
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)",
              },
            }}
          >
            Add Block
          </Button>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData}
        columns={columns.concat(actionColumn)}
      />

      <AddDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddBlock}  
        refreshData={fetchBlockList}  
      />

    </div>
  );
};


const AddDialog = ({ open, onClose, onAdd , refreshData }) => {
  const [blockNo, setBlockNo] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!blockNo.trim()) {
    setError("Block No. is required.");
    return;
  }

  const ins_date = new Date().toISOString();

  const newBlock = {
    block_no: blockNo.trim(),
    status,
    ins_date,
  };

  const token = localStorage.getItem("token");

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

  try {
    const response = await axios.post(
      `https://${window.location.hostname}:4000/addBlock`,
      newBlock,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      Toast.fire({
        icon: "success",
        title: response.data.message || "Block added successfully!",
      });

      if (refreshData) {
        await refreshData();  
      }

      handleClose(); 
    } else {
      Toast.fire({
        icon: "error",
        title: response.data.message || "Failed to add block.",
      });

      if (response.status === 409) {
        handleClose();  
      }
    }
  } catch (error) {
    console.error("Error adding block:", error);

    const errorMessage =
      error.response?.data?.message ||
      "Failed to add block. Please try again.";

    Toast.fire({
      icon: "error",
      title: errorMessage,
    });

    if (error.response?.status === 409) {
      handleClose();  
    }
  }

  setBlockNo("");
  setStatus("active");
  setError("");
};

  const handleClose = () => {
    setBlockNo("");
    setStatus("active");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          boxShadow: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Add New Block
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <TextField
          label="Block Number"
          type="number"
          fullWidth
          value={blockNo}
          onChange={(e) => setBlockNo(e.target.value)}
          error={!!error}
          helperText={error}
          size="medium"
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "1rem",
            },
            "& .MuiFormLabel-root": {
              fontWeight: 500,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockList;
