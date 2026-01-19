import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const EditPro = ({ profileData, handleClose, open, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: profileData?.full_name || "",
    userId: profileData?.user_id || "",
    useDID: profileData?.use_did || "",
    campaignId: profileData?.campaigns_id || "",
    password: "",
    email: profileData?.admin_email || "",
    mobile: profileData?.admin_mobile || "",
    timezone: profileData?.user_timezone || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const [campaignOptions, setCampaignOptions] = useState([]);
  const [logoFile, setLogoFile] = useState(null); // for company logo

  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (profileData?.user_type == 9 || profileData?.user_type == 8) {
      // Super Admin (9) or Admin (8) → Fetch all campaigns
      axios
        .get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
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
    } else {
      setCampaignOptions([
        {
          id: profileData?.campaigns_id,
          label: profileData?.campaign_name || profileData?.campaigns_id,
        },
      ]);
    }
  }, [profileData]);

  const validate = () => {
    const tempErrors = {};

    if (!formData.fullName.trim())
      tempErrors.fullName = "Full Name is required";
    if (formData.useDID.trim()) {
      if (!/^\d{1,10}$/.test(formData.useDID)) {
        tempErrors.useDID = "Use DID must be a number with up to 10 digits";
      }
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Valid email is required";
    if (!formData.mobile.trim() || !/^\+?\d{7,15}$/.test(formData.mobile))
      tempErrors.mobile = "Valid mobile number is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "password" && !formData[key]) return;
          formDataToSend.append(key, formData[key]);
        });

        if (profilePicture) {
          formDataToSend.append("profilePicture", profilePicture);
        }

        if (logoFile) {
          formDataToSend.append("companyLogo", logoFile);
        }

        const response = await axios.put(
          `https://${window.location.hostname}:4000/users/${formData.userId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.admin_logo) {
          localStorage.setItem("admin_logo", response.data.admin_logo);
        }
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Profile updated successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        onSuccess?.(response.data);
        handleClose();
      } catch (error) {
        console.error("Error updating profile:", error);

        // ❌ error toast
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title:
            error.response?.data?.message ||
            "There was an error updating your profile",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" }, // less dark
        }}
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
          Edit Profile
          <IconButton onClick={handleClose}>
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
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="User ID"
                  name="userId"
                  value={formData.userId}
                  disabled
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName}
                  fullWidth
                  margin="dense"
                />
              </Grid>

              {(profileData?.user_type == 9 || profileData?.user_type == 8) && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Use DID"
                    name="useDID"
                    value={formData.useDID}
                    onChange={handleChange}
                    error={Boolean(errors.useDID)}
                    helperText={errors.useDID}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                {profileData?.user_type == 9 || profileData?.user_type == 8 ? (
                  <TextField
                    label="Campaign ID"
                    select
                    name="campaignId"
                    value={formData.campaignId}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                  >
                    {campaignOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="Campaign ID"
                    name="campaignId"
                    value={formData.campaignId}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                  margin="dense"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={Boolean(errors.mobile)}
                  helperText={errors.mobile}
                  fullWidth
                  margin="dense"
                />
              </Grid>
              {(profileData?.user_type == 9 || profileData?.user_type == 8) && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                  >
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                    <MenuItem value="America/New_York">
                      America/New_York
                    </MenuItem>
                    <MenuItem value="Europe/Istanbul">Europe/Istanbul</MenuItem>
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center">
                  {/* Profile Picture */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ mb: 1, fontWeight: "bold" }}>
                      Profile Picture
                    </InputLabel>
                    <label
                      htmlFor="upload-photo"
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <img
                        src={
                          profilePicture
                            ? URL.createObjectURL(profilePicture)
                            : "https://via.placeholder.com/120x120?text=Upload"
                        }
                        alt="Upload Profile"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "contain",
                          background: "#fff",
                          borderRadius: "12px",
                          border: "2px solid #ccc",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "0.3s ease",
                        }}
                      />
                    </label>
                    <input
                      id="upload-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </Grid>

                  {/* ✅ Company Logo only for Admin/Superadmin */}
                  {(profileData?.user_type == 9 ||
                    profileData?.user_type == 8) && (
                    <Grid item xs={12} sm={6}>
                      <InputLabel sx={{ mb: 1, fontWeight: "bold" }}>
                        Company Logo
                      </InputLabel>
                      <label
                        htmlFor="upload-logo"
                        style={{ cursor: "pointer", display: "inline-block" }}
                      >
                        <img
                          src={
                            logoFile
                              ? URL.createObjectURL(logoFile)
                              : "https://via.placeholder.com/120x120?text=Logo"
                          }
                          alt="Upload Logo"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "2px solid #ccc",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            transition: "0.3s ease",
                          }}
                        />
                      </label>
                      <input
                        id="upload-logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: "none" }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            color="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPro;
