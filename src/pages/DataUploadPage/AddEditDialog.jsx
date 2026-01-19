import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const AddEditDialog = ({
  open,
  onClose,
  isEditMode,
  formData,
  handleFormChange,
  handleSaveAdd,
  handleUpdate,
  campaignOptions,
}) => {
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
        {isEditMode ? "Edit List" : "Add New List"}
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
              label="List ID"
              name="listId"
              value={formData.listId}
              onChange={handleFormChange}
              fullWidth
              margin="dense"
              disabled={isEditMode}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="List Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="List Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Select Campaign"
              name="campaign"
              value={formData.campaign}
              onChange={handleFormChange}
              fullWidth
              margin="dense"
            >
              {campaignOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={isEditMode ? handleUpdate : handleSaveAdd}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditDialog;
