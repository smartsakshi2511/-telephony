import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Slide,
  Tooltip,
  IconButton,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LeadFormModal = ({ open, onClose, prefill }) => {
  const initialFormState = {
    email: "",
    name: "",
    phone_number: "",  
    date: "",
    dialstatus: "",
    remark: "",
      city : "",
    reminder_datetime: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [statusOptions, setStatusOptions] = useState([]);
  const [dispoMeta, setDispoMeta] = useState([]);
  const [showReminder, setShowReminder] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 
  const debounceRef = useRef(null);
  const requestSeqRef = useRef(0);

  /* -------------------- UTILITIES -------------------- */
  const normalizeNumber = useCallback((raw) => (raw ? (raw.match(/\d+/g) || []).join("") : ""), []);

  const mergeFieldsIfEmpty = useCallback((rowData) => {
    setFormData((prev) => {
      const next = { ...prev };
      Object.keys(rowData).forEach((key) => {
        if (key in next) {
          const currentVal = next[key];
          const newVal = rowData[key];

          if (
            (currentVal === "" ||
              currentVal === null ||
              typeof currentVal === "undefined") &&
            newVal !== null &&
            typeof newVal !== "undefined" &&
            String(newVal).trim() !== ""
          ) {
            next[key] = newVal;
          }
        }
      });
      return next;
    });
  }, []);

  /* -------------------- AUTO-FILL (DEBOUNCED) -------------------- */
  const autoFillIfNeeded = useCallback(
    async (rawNumber, mySeq) => {
      try {
        if (!rawNumber) return;
        const nameEmpty = !formData.name?.trim();
        const emailEmpty = !formData.email?.trim();
        if (!nameEmpty && !emailEmpty) return;

        const digits = normalizeNumber(rawNumber);
        if (!digits) return;
        const last6 = digits.slice(-6);

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${window.location.hostname}:4000/company-info/search?number=${encodeURIComponent(
            last6
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ignore stale responses
        if (mySeq < requestSeqRef.current) return;

        if (res.data?.found && res.data.data) {
          mergeFieldsIfEmpty(res.data.data);
        }
      } catch (err) {
        // keep error handling simple; log for debugging
        console.error("Company auto-fill error:", err);
      }
    },
    [formData.name, formData.email, mergeFieldsIfEmpty, normalizeNumber]
  );

  // watch phone_number changes and debounce auto-fill
  useEffect(() => {
    // don't run if modal closed
    if (!open) return;

    // only trigger if phone_number is non-empty
    const phone = formData.phone_number;
    if (!phone) return;

    // don't hit backend if name & email already present
    if (formData.name?.trim() && formData.email?.trim()) return;

    // debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // bump sequence id
    const mySeq = ++requestSeqRef.current;

    debounceRef.current = setTimeout(() => {
      autoFillIfNeeded(phone, mySeq);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [formData.phone_number, formData.name, formData.email, autoFillIfNeeded, open]);

  /* -------------------- PREFILL LOGIC -------------------- */
  useEffect(() => {
    if (open && prefill) {
      setFormData((prev) => ({ ...prev, ...prefill }));
    }
  }, [open, prefill]);

  // run immediate auto-fill for prefill phone once when modal opens
  useEffect(() => {
    if (!open) return;
    if (prefill?.phone_number) {
      // use zero timeout so this runs after the above setFormData effect
      setTimeout(() => {
        // bump seq and call directly (autoFillIfNeeded will early-return if name/email present)
        const mySeq = ++requestSeqRef.current;
        autoFillIfNeeded(prefill.phone_number, mySeq);
      }, 0);
    }
  }, [open, prefill, autoFillIfNeeded]);

  /* -------------------- WRAP-UP TIMER -------------------- */
  useEffect(() => {
    if (!open) return;
    let intervalId;

    const fetchWrap = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${window.location.hostname}:4000/agent-wrapup-status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.status === "wrapup") {
          let startTime;
          if (res.data.wait_for_next_call) {
            startTime = new Date(res.data.wait_for_next_call.replace(" ", "T")).getTime();
          } else {
            startTime = Date.now();
          }

          const endTime = startTime + (res.data.defaultTimer || 120) * 1000;

          const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(diff);
            if (diff <= 0 && intervalId) clearInterval(intervalId);
          };

          updateTimer();
          intervalId = setInterval(updateTimer, 1000);
        } else {
          setTimeLeft(0);
        }
      } catch (err) {
        console.error("Wrap-up fetch error:", err);
      }
    };

    fetchWrap();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [open]);

  const updateWrapup = useCallback(async (status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://${window.location.hostname}:4000/agent-wrapup`,
        { wrapup: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Wrapup update error:", err);
    }
  }, []);

  useEffect(() => {
    if (open) updateWrapup(1);
  }, [open, updateWrapup]);

  /* -------------------- GET DISPOSITIONS -------------------- */
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${window.location.hostname}:4000/get-dispositions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!mounted) return;
        setDispoMeta(res.data.dispositions || []);
        setStatusOptions((res.data.dispositions || []).map((d) => d.dispo));
      } catch (err) {
        console.error("Error fetching statuses", err);
      }
    };

    fetchStatuses();
    return () => {
      mounted = false;
    };
  }, [open]);

  /* -------------------- RESET ON CLOSE -------------------- */
  useEffect(() => {
    if (!open) {
      // clear debounce if any
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setFormData(initialFormState);
      setShowReminder(false);
      setTimeLeft(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* -------------------- REMINDER TOGGLE -------------------- */
  useEffect(() => {
    if (prefill?.dialstatus && dispoMeta.length > 0) {
      const selected = dispoMeta.find((d) => d.dispo === prefill.dialstatus);
      setShowReminder(selected?.reminder === 1 || selected?.reminder === "1");
    }
  }, [dispoMeta, prefill]);

  /* -------------------- BASIC FORM CHANGE -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "dialstatus") {
      const selected = dispoMeta.find((d) => d.dispo === value);
      setShowReminder(selected?.reminder === 1 || selected?.reminder === "1");
    }
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });

    try {
      const token = localStorage.getItem("token");

      const leadRes = await axios.post(
        `https://${window.location.hostname}:4000/add-lead`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const leadId = leadRes.data.lead_id;

      // Reminder
      if (showReminder && formData.reminder_datetime) {
        const utcDatetime = new Date(formData.reminder_datetime)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        await axios.post(
          `https://${window.location.hostname}:4000/reminders`,
          {
            datetime: utcDatetime,
            message: `Lead: ${formData.name}`,
            lead_id: leadId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Toast.fire({ icon: "success", title: "Lead submitted successfully" });

      await updateWrapup(0);
      setFormData(initialFormState);
      setShowReminder(false);
      setTimeLeft(0);
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      Toast.fire({ icon: "error", title: "Failed to submit lead" });
    }
  };

  /* -------------------- RESET BUTTON -------------------- */
  const handleCancel = async () => {
    setFormData(initialFormState);
    setShowReminder(false);
    setTimeLeft(0);
    await updateWrapup(0);
    onClose();
  };

  /* -------------------- UI -------------------- */
  return (
    <Dialog open={open} TransitionComponent={Transition} fullWidth maxWidth="sm">
      <Box sx={{ position: "relative" }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #404eb5, #2d3b8a)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <PersonIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lead Form
              </Typography>

              {timeLeft > 0 && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: timeLeft <= 30 ? "red" : "#ffb74d",
                    fontWeight: "bold",
                  }}
                >
                  ⏳ Wrap up: {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </Typography>
              )}
            </Box>
          </Box>

          <Tooltip title="Close">
            <IconButton
              sx={{ color: "white" }}
              onClick={async () => {
                await updateWrapup(0);
                onClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Contact Info */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Contact Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </Grid>
            

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  select
                  fullWidth
                  size="small"
                  label="Status"
                  name="dialstatus"
                  value={formData.dialstatus}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {showReminder && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="Set Reminder"
                    name="reminder_datetime"
                    type="datetime-local"
                    value={formData.reminder_datetime}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {/* Remark */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                  Additional Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  multiline
                  maxRows={4}
                />
              </Grid>

                <Grid item xs={12} sm={6}>
               <TextField
                  required
                  fullWidth
                  size="small"
                  label="Address"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCancel} color="error" variant="outlined">
              Reset
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};

export default LeadFormModal;
