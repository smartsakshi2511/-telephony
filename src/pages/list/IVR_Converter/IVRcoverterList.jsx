import "../list.scss";
import { useEffect, useState } from "react";
import AddDialog from "./AddIVR";
import Swal from "sweetalert2";
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
} from "@mui/material";
import PaginatedGrid from '../../Pagination/PaginatedGrid';
import dayjs from 'dayjs';

import AddIcon from "@mui/icons-material/Add";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

const backendBaseUrl = `https://${window.location.hostname}:4000/ivr/`;

const ivrColumns = [
  {
    field: "id",
    headerName: "SR NO.",
    flex: 0.5,
  },
  {
    field: "type",
    headerName: "TYPE",
    flex: 1,
  },
  {
    field: "campaign_name",
    headerName: "CAMPAIGN",
    flex: 1,
  },
  {
    field: "file_name",
    headerName: "FILE",
    flex: 2,
    renderCell: (params) => {
      let audioUrl = params.row.file_name ? `${backendBaseUrl}${params.row.file_name}` : "";

      return (
        <audio className="customAudio" controls>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    },
  },

  {
  field: "date",
  headerName: "DATE",
  flex: 1.5,
  renderCell: (params) => {
    const formattedDate = dayjs(params.row.date).format("YYYY-MM-DD HH:mm:ss");
    return <span>{formattedDate}</span>;
  }
}

];

const IVRList = () => {
  const [data, setData] = useState([]);
  const [editRowId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editIVR, setEditIVR] = useState({
    id: "",
    type: "",
    campaign: "",
    file: "",
    date: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`https://${window.location.hostname}:4000/ivrConverter`, config)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);


  const filteredRows = data.filter((row) =>
  (row.file_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    row.type?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    row.campaign_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    row.date?.toLowerCase()?.includes(searchQuery.toLowerCase()))
  );


  const handleDelete = async (id) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `https://${window.location.hostname}:4000/deleteIVR/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("Delete Response:", response.data);
          setData((prevData) => prevData.filter((item) => item.id !== id));

          Toast.fire({
            icon: "success",
            title: "IVR deleted successfully!"
          });

        } catch (error) {
          console.error("Error deleting IVR:", error);

          Toast.fire({
            icon: "error",
            title: "Failed to delete IVR. Please try again."
          });
        }
      }
    });
  };


  const handleEdit = (id) => {
    const ivrToEdit = data.find((item) => item.id === id);
    if (ivrToEdit) {
      setEditIVR(ivrToEdit);
      setEditDialogOpen(true);
    } else {
      Swal.fire("Error", "IVR not found.", "error");
    }
  };

  const handleSaveEdit = async () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://${window.location.hostname}:4000/updateSpeech/${editIVR.id}`,
        {
          type: editIVR.type,
          campaign_name: editIVR.campaign_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.id === editIVR.id
            ? {
              ...item,
              type: editIVR.type,
              campaign_name: editIVR.campaign_name,
            }
            : item
        )
      );
      setEditDialogOpen(false);

      Toast.fire({
        icon: "success",
        title: "IVR updated successfully!"
      });

    } catch (error) {
      console.error("Error updating IVR:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to update IVR."
      });
    }
  };


  const handleUpdate = (e) => {
    if (editIVR) {
      setEditIVR({
        ...editIVR,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleAddIVR = (newIVR) => {
    const newId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newSrNo =
      data.length > 0 ? Math.max(...data.map((item) => item.srNo)) + 1 : 1;
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const ivrToAdd = {
      id: newId,
      srNo: newSrNo,
      type: newIVR.type,
      campaign_name: newIVR.campaign,
      file_name: newIVR.file,
      date: newIVR.date || formattedDate,
      status: "active",
    };
    setData([...data, ivrToAdd]);
    handleCloseAddDialog();
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
                  color="info"
                  onClick={() => handleEdit(params.row.id)}
                  style={{
                    padding: "4px",
                    border: "2px solid green",
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
          </div>
        );
      },
    },
  ];

  const columns = [...ivrColumns, ...actionColumn];

  return (
    <div className="datatable">
      <div className="datatableTitle" style={styles.datatableTitle}>
        <b>IVR CONVERTER LIST</b>
        <div className="callFilter">
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginBottom: "30px",
              marginLeft: "5px",
              marginTop: "30px",
            }}
            InputProps={{
              style: {
                height: "40px",
                padding: "0px",
                fontSize: "14px",
              },
            }}
          />

          <Button
            onClick={handleOpenAddDialog}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)", // Darker shade on hover
              },
            }}
            startIcon={<AddIcon />}
          >
            create Speech
          </Button>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredRows}
        columns={columns}
      />

      <AddDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddIVR}
        setData={setData}
      />
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        ivr={editIVR}
        onChange={handleUpdate}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

const styles = {
  datatableTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
};

const EditDialog = ({ open, onClose, ivr, onChange, onSave }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
        headers: { Authorization: `Bearer ${token}` }, // No need for query params
      })
      .then((response) => {
        console.log("Fetched Campaigns:", response.data); // Debugging
        const options = response.data.map((campaign) => ({
          id: campaign.compaign_id,
          label: campaign.compaignname,
        }));
        setCampaignOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);



  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 2,
        }}
      >
        Assign Speech
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          px: 3,
          pt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "15px",
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Type"
              fullWidth
              required
              name="type"
              value={ivr?.type || ""}
              onChange={onChange}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="campaign_name"
              label="Select Campaign ID"
              fullWidth
              variant="outlined"
              select
              value={ivr?.campaign_name || ""}
              onChange={onChange}
            >
              {campaignOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default IVRList;
