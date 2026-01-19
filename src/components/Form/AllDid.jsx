import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from "../../context/searchBar";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../context/authContext";

const AllDid = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [maxDialogOpen, setMaxDialogOpen] = useState(false);
  const [tfnNumber, setTfnNumber] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [maxUsesCount, setMaxUsesCount] = useState("");



  const { user } = useContext(AuthContext);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://${window.location.hostname}:4000/getAllDids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const mapped = res.data.data.map((item) => ({
            ...item,
            id: item.id, // MUI needs id field
          }));
          setData(mapped);
        }
      } catch (err) {
        console.error("Error fetching DIDs:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this DID?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

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
      const token = localStorage.getItem("token");
      const res = await axios.delete(`https://${window.location.hostname}:4000/deleteDid/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setData((prev) => prev.filter((item) => item.id !== id));
        Toast.fire({
          icon: "success",
          title: "DID deleted successfully!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: res.data.message || "Failed to delete DID",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      Toast.fire({
        icon: "error",
        title: "Something went wrong while deleting DID.",
      });
    }
  };


  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMenuItemClick = (action) => {
    setAnchorEl(null);
    if (action === "Add DIDs") setAddDialogOpen(true);
    if (action === "Set Max Uses Count") setMaxDialogOpen(true);
    if (action === "Reset Uses Count") setResetDialogOpen(true); // 👈 Add this line
  };
  ;

  const handleAddDid = async () => {
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

    if (!tfnNumber.trim()) {
      Toast.fire({
        icon: "warning",
        title: "Please enter a TFN number",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://${window.location.hostname}:4000/addDid`,
        { tfn: tfnNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newDid = res.data.newDid;

        if (newDid && newDid.id) {
          // ✅ Add new DID to DataGrid immediately
          setData((prevData) => [...prevData, { ...newDid, id: newDid.id }]);

          Toast.fire({
            icon: "success",
            title: "DID added successfully!",
          });

          setAddDialogOpen(false);
          setTfnNumber("");
        } else {
          Toast.fire({
            icon: "error",
            title: "DID added, but data incomplete.",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: res.data.message || "Failed to add DID",
        });
      }
    } catch (err) {
      console.error("Add DID error:", err);
      Toast.fire({
        icon: "error",
        title: "Something went wrong while adding DID.",
      });
    }
  };


  const columns = [
    {
      field: "id",
      headerName: "Sr.No.",
      flex: 1,
      sortable: false,
      filterable: false,
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
    },
    { field: "tfn", headerName: "DID Number", flex: 1 },
    { field: "uses_count", headerName: "Use Count", flex: 1 },
    { field: "max_uses_count", headerName: "Use Limit", flex: 1 },
    { field: "last_updated_time", headerName: "Last Use Time", flex: 1 },
    { field: "date", headerName: "Created Date Time", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // ✅ Prevents row selection on click
            handleDelete(params.row.id);
          }}
          sx={{
            padding: "2px 5px",
            borderRadius: "5px",
            color: "crimson",
            border: "1px solid rgba(220, 20, 60, 0.6)",
            cursor: "pointer",
            minWidth: "32px"
          }}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    }



  ];

  const filteredData = data.filter((item) =>
    item.tfn.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <b style={{ fontSize: "1.2rem" }}>DID LIST</b>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search DID Number..."
          />

          <Button
            variant="contained"
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)",
              },
            }}
          >
            Bulk Action
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleMenuItemClick("Add DIDs")}>Add DIDs</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Reset Uses Count")}>Reset Uses Count</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Set Max Uses Count")}>Set Max Uses Count</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Remove DIDs")}>Remove DIDs</MenuItem>
          </Menu>
        </div>
      </div>

      <DataGrid
        rows={filteredData}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick={true} // ✅ ONLY checkbox click selects the row
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        getRowId={(row) => row.id}
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection);
          console.log("Selected IDs:", newSelection);
        }}
        sx={{ fontSize: "12px" }}
      />


      {/* Add DID Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>
          Add DID
          <IconButton onClick={() => setAddDialogOpen(false)} style={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Enter TFN Number"
            fullWidth
            margin="normal"
            type="number"
            value={tfnNumber}
            onChange={(e) => setTfnNumber(e.target.value)}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <input type="file" style={{ marginTop: "15px", width: "100%" }} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddDid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Max Uses Count Dialog */}
      <Dialog open={maxDialogOpen} onClose={() => setMaxDialogOpen(false)}>
        <DialogTitle>
          Set Max Uses Count DID Limit.
          <IconButton onClick={() => setMaxDialogOpen(false)} style={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter the new maximum uses limit for selected DIDs.
          </Typography>
          {selectionModel.length === 0 ? (
            <Typography color="error">Please select at least one DID.</Typography>
          ) : (
            <>
              <Typography>
                Selected Sr. No:{" "}
                {selectionModel
                  .map((id) => {
                    const index = filteredData.findIndex((row) => row.id === id);
                    return index >= 0 ? index + 1 : "?";
                  })
                  .join(", ")}
              </Typography>

              <Typography sx={{ fontSize: "12px", color: "gray", mt: 1 }}>
                (Backend IDs: {selectionModel.join(", ")})
              </Typography>

              <TextField
                label="Enter Uses Counter Limit"
                fullWidth
                margin="normal"
                type="number"
                value={maxUsesCount}
                onChange={(e) => setMaxUsesCount(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disabled={selectionModel.length === 0 || !maxUsesCount}
            onClick={async () => {
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
                const token = localStorage.getItem("token");
                const res = await axios.put(
                  `https://${window.location.hostname}:4000/updateMaxUsesCount`,
                  {
                    ids: selectionModel,
                    max_uses_count: maxUsesCount,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (res.data.success) {
                  // Update local state
                  setData((prev) =>
                    prev.map((item) =>
                      selectionModel.includes(item.id)
                        ? { ...item, max_uses_count: maxUsesCount }
                        : item
                    )
                  );

                  Toast.fire({ icon: "success", title: "Max uses count updated!" });
                  setMaxDialogOpen(false);
                  setMaxUsesCount("");
                } else {
                  Toast.fire({ icon: "error", title: res.data.message || "Update failed." });
                }
              } catch (err) {
                console.error("Update error:", err);
                Toast.fire({ icon: "error", title: "Something went wrong." });
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>




      {/* Reset Uses Count Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>
          Reset Uses Count
          <IconButton onClick={() => setResetDialogOpen(false)} style={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            This will reset the "uses_count" to 0 for the selected DIDs.
          </Typography>
          {selectionModel.length === 0 ? (
            <Typography color="error">Please select at least one DID.</Typography>
          ) : (
            <Typography>
              Selected ID :{" "}
              {selectionModel
                .map((id) => {
                  const index = filteredData.findIndex((row) => row.id === id);
                  return index >= 0 ? index + 1 : "?";
                })
                .join(", ")}
            </Typography>

          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={selectionModel.length === 0}
            onClick={async () => {
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
                const token = localStorage.getItem("token");
                const res = await axios.put(
                  `https://${window.location.hostname}:4000/resetUsesCount`,
                  { ids: selectionModel },
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.success) {
                  setData((prev) =>
                    prev.map((item) =>
                      selectionModel.includes(item.id)
                        ? { ...item, uses_count: 0 }
                        : item
                    )
                  );

                  Toast.fire({
                    icon: "success",
                    title: "Uses count reset successfully!",
                  });

                  setResetDialogOpen(false);
                } else {
                  Toast.fire({
                    icon: "error",
                    title: res.data.message || "Reset failed.",
                  });
                }
              } catch (err) {
                console.error("Reset error:", err);
                Toast.fire({
                  icon: "error",
                  title: "Something went wrong.",
                });
              }
            }}

          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default AllDid;
