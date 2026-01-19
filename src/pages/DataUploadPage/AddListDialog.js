import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const AddListDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    LIST_ID: "",
    NAME: "",
    DESCRIPTION: "",
    CAMPAIGN: "",
    LEADS_COUNT: 0,
    ACTIVE: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ACTIVE" ? e.target.checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/lists`,
        {
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201) {
        onSave(response.data);
        onClose();
      } else {
        alert("Failed to add list.");
      }
    } catch (error) {
      console.error("Error adding list:", error);
      alert("An error occurred while adding the list.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New List</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="NAME"
          value={formData.NAME}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="DESCRIPTION"
          value={formData.DESCRIPTION}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Campaign"
          name="CAMPAIGN"
          value={formData.CAMPAIGN}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Leads Count"
          name="LEADS_COUNT"
          type="number"
          value={formData.LEADS_COUNT}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <label>
          Active:
          <input
            name="ACTIVE"
            type="checkbox"
            checked={formData.ACTIVE}
            onChange={handleChange}
          />
        </label>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddListDialog;
