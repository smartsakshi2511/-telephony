// src/pages/profile/EditProfile/EditPro.jsx

import React, { useState } from "react"; 
import "./Profile.scss";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  InputLabel,
  Input,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
// import axios from "axios";  

const EditPro = ({ profileData, handleClose }) => {
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || "",
    userId: profileData.userId || "9990_Admin",
    useDID: profileData.useDID || "", //  
    campaignName: profileData.campaignName || "",  
    password: "",  
    email: profileData.email || "demo@gmail.com",
    mobile: profileData.mobile || "732674823",
    profilePicture: profileData.profilePicture || "", 
    timezone: "Indian TimeZone (Asia/Kolkata)",  
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Define campaign options
  const campaignOptions = [
    { value: "Campaign A", label: "Campaign A" },
    { value: "Campaign B", label: "Campaign B" },
    { value: "Campaign C", label: "Campaign C" },
    // Add more campaigns as needed
  ];

 
  const validate = () => {
    let tempErrors = {};

    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required";
    if (!formData.userId.trim()) tempErrors.userId = "User ID is required";
    
    if (!formData.useDID.trim()) {
      tempErrors.useDID = "Use DID is required";
    } else if (!/^\d{1,12}$/.test(formData.useDID)) {
      tempErrors.useDID = "Use DID must be a number with up to 12 digits";
    }

    if (!formData.campaignName.trim()) {
      tempErrors.campaignName = "Campaign Name is required";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\+?\d{7,15}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number is invalid";
    }

    // Add more validations as needed

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64 string for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Prepare data to send; exclude password if not changing
        const dataToSend = {
          fullName: formData.fullName,
          userId: formData.userId,
          useDID: formData.useDID, // Now a number
          campaignName: formData.campaignName,
          email: formData.email,
          mobile: formData.mobile,
          profilePicture: formData.profilePicture, // Handle file upload appropriately
          timezone: formData.timezone,
        };
        if (formData.password.trim() !== "") {
          dataToSend.password = formData.password;
        }

        // TODO: Uncomment and replace with your actual API endpoint when ready
        /*
        // Make an API call to update the profile
        await axios.put(`https://api.example.com/users/${formData.userId}`, dataToSend);
        */

        // For now, simulate successful submission
        console.log("Form Submitted:", dataToSend);

        // Optionally, show a success message or update parent state

        handleClose(); // Close the modal after successful submission
      } catch (error) {
        console.error("Error updating profile:", error);
        // Optionally, set error messages or show notifications
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <form className="editProForm">
          {/* User ID (Non-editable) */}
          <TextField
            margin="dense"
            label="User ID"
            name="userId"
            fullWidth
            variant="outlined"
            value={formData.userId}
            disabled
          />

          {/* Full Name */}
          <TextField
            margin="dense"
            label="Full Name"
            name="fullName"
            fullWidth
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName}
          />

          {/* Use DID (Number Input) */}
          <TextField
            margin="dense"
            label="Use DID"
            name="useDID"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.useDID}
            onChange={handleChange}
            error={Boolean(errors.useDID)}
            helperText={errors.useDID}
            inputProps={{ maxLength: 12 }}
          />

          {/* Campaign Name (Dropdown) */}
          <FormControl
            margin="dense"
            fullWidth
            variant="outlined"
            error={Boolean(errors.campaignName)}
          >
            <InputLabel id="campaign-name-label">Campaign Name</InputLabel>
            <Select
              labelId="campaign-name-label"
              id="campaign-name"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              label="Campaign Name"
            >
              {campaignOptions.map((campaign) => (
                <MenuItem key={campaign.value} value={campaign.value}>
                  {campaign.label}
                </MenuItem>
              ))}
            </Select>
            {errors.campaignName && (
              <FormHelperText>{errors.campaignName}</FormHelperText>
            )}
          </FormControl>

          {/* Password */}
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password || "Leave blank to keep current password"}
          />

          {/* Email */}
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          {/* Mobile */}
          <TextField
            margin="dense"
            label="Mobile"
            name="mobile"
            type="tel"
            fullWidth
            variant="outlined"
            value={formData.mobile}
            onChange={handleChange}
            error={Boolean(errors.mobile)}
            helperText={errors.mobile}
          />

          {/* Upload Profile */}
          <div className="uploadProfile">
            <InputLabel htmlFor="profile-picture">Upload Profile</InputLabel>
            <Input
              id="profile-picture"
              name="profilePicture"
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: "image/*" }}
            />
            {formData.profilePicture && (
              <img
                src={formData.profilePicture}
                alt="Profile Preview"
                className="profilePreview"
              />
            )}
          </div>

          {/* Timezone (Non-editable) */}
          <TextField
            margin="dense"
            label="Timezone"
            name="timezone"
            fullWidth
            variant="outlined"
            value={formData.timezone}
            disabled
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
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
    </>
  );
};

export default EditPro;
