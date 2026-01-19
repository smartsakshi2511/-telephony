import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  Slide,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialFormState = {
  name: "",
  mobile: "",
  altMobile: "",
  whoMet: "",
  documentsShown: "",
  relationWithApplicant: "",
  existenceInYears: "",
  ownedOrRented: "",
  personsVisited: "",
  feBehavior: "",
  contactNumberAsked: "",
  loanApplicationElsewhere: "",
  entercasenumber: "",
  email: "",
};

const requiredFields = [ "mobile"];

const VerificationModal = ({ open, onClose, prefill = {} }) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderData, setReminderData] = useState({
    reminderDate: "",
    reminderNotes: "",
  });
 
  const inputStyles = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "& fieldset": { borderColor: "#d1d9e6" },
        "&:hover fieldset": { borderColor: "#3f51b5" },
        "&.Mui-focused fieldset": {
          borderColor: "#3f51b5",
          boxShadow: "0 0 6px rgba(63,81,181,0.4)",
        },
      },
    }),
    []
  );
 
  const fieldConfigs = useMemo(
    () => [
      { label: "Enter Name", name: "name" },
      { label: "Mobile Number", name: "mobile", maxLength: 12 },
      { label: "Email", name: "email" },
      { label: "Landmark / Alt Mobile", name: "altMobile" },
      { label: "Who met with him?", name: "whoMet" },
      { label: "Documents shown to FE?", name: "documentsShown" },
      { label: "Relation with applicant?", name: "relationWithApplicant" },
      { label: "Existence in years?", name: "existenceInYears" },
      { label: "Owned or Rented?", name: "ownedOrRented" },
      { label: "Visitors during verification?", name: "personsVisited" },
      { label: "FE behavior?", name: "feBehavior" },
      { label: "Did FE ask contact number?", name: "contactNumberAsked" },
      { label: "Did FE ask to apply elsewhere?", name: "loanApplicationElsewhere" },
      { label: "Case Number", name: "entercasenumber" },
    ],
    []
  );

 useEffect(() => {
  if (!open) {
    setFormValues(initialFormState);
    setShowReminder(false);
    setReminderData({ reminderDate: "", reminderNotes: "" });
    return;
  }

  if (prefill && prefill.mobile) {
    setFormValues({ ...initialFormState, ...prefill });
  }
}, [open, prefill?.mobile]);  

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCancel = useCallback(() => {
    setFormValues(initialFormState);
    setShowReminder(false);
    setReminderData({ reminderDate: "", reminderNotes: "" });
  }, []);

  const handleDialogClose = useCallback(() => {
    handleCancel();
    if (onClose) onClose();
  }, [handleCancel, onClose]);
 
  const renderedFields = useMemo(
    () =>
      fieldConfigs.map((field, index) => (
        <Grid item xs={12} sm={field.multiline ? 12 : 4} key={index}>
          <TextField
            fullWidth
            size="small"
            label={`${field.label}${
              requiredFields.includes(field.name) ? " *" : ""
            }`}
            name={field.name}
            value={formValues[field.name] || ""}
            onChange={handleChange}
            multiline={field.multiline || false}
            rows={field.multiline ? 2 : undefined}
            inputProps={
              field.maxLength
                ? {
                    maxLength: field.maxLength,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }
                : undefined
            }
            required={requiredFields.includes(field.name)}
            sx={inputStyles}
          />
        </Grid>
      )),
    [formValues, handleChange, fieldConfigs, inputStyles]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = { ...formValues };

      const response = await axios.post(
        `https://${window.location.hostname}:4000/submit-verification`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const verificationId = response.data.id;

        if (showReminder && reminderData.reminderDate) {
          const utcDatetime = new Date(reminderData.reminderDate)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          await axios.post(
            `https://${window.location.hostname}:4000/reminders`,
            {
              datetime: utcDatetime,
              message: `Verification: ${formValues.name}`,
              verification_id: verificationId,
              notes: reminderData.reminderNotes,
              email: formValues.email,
              phone_number: formValues.mobile,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Verification data submitted successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        handleDialogClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error submitting verification form.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      keepMounted
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleDialogClose();
        }
      }}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          width: "800px",
          borderRadius: 4,
          boxShadow: 10,
          background: "linear-gradient(to bottom right, #ffffff, #f0f4f8)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflowX: "hidden",
          wordBreak: "break-word",
        },
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: "linear-gradient(90deg, #404eb5, #2d3b8a)",
            color: "white",
            py: 2,
            px: 3,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 30 }} />
          <Box>
            <Typography variant="h6">Verification Form</Typography>
            <Typography variant="caption">
              Please fill in all mandatory details
            </Typography>
          </Box>

          <IconButton
            sx={{
              ml: "auto",
              color: "white",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              borderRadius: "50%",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onClick={handleDialogClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              p: 3,
              overflowY: "scroll",
              overflowX: "hidden",
              wordBreak: "break-word",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Grid container spacing={2}>
              {renderedFields}
 
              <Grid item  >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showReminder}
                      onChange={(e) => setShowReminder(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Set Reminder"
                />
              </Grid>

              {showReminder && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Reminder Date"
                      type="datetime-local"
                      fullWidth
                      size="small"
                      value={reminderData.reminderDate}
                      onChange={(e) =>
                        setReminderData((prev) => ({
                          ...prev,
                          reminderDate: e.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Reminder Notes"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={reminderData.reminderNotes}
                      onChange={(e) =>
                        setReminderData((prev) => ({
                          ...prev,
                          reminderNotes: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleCancel} color="error" variant="outlined">
              Reset
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};

export default VerificationModal;
