import "./new.scss";
 
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API requests
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const New = ({ title }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    useDID: "",
    selectuser: "",
    password: "",
    externalNumber: "",
    campaignName: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState("");

  // Mapping of field names to their detailed descriptions
  const fieldDetails = {
    userId: "Your unique identifier in the system. This ID cannot be changed once set.",
    username: "The name you'll use to log into the system. It should be unique and memorable.",
    useDID: "Direct Inward Dialing (DID) number assigned to your account. It allows direct calling to your extension without going through a main number.",
    selectuser: "Choose the type of user role. Admins have full access, while Users have limited permissions.",
    password: "Create a strong password to secure your account. It should be at least 6 characters long.",
    externalNumber: "The external contact number associated with your account. Ensure it's a valid and reachable number.",
    campaignName: "Select the marketing campaign you're associated with. Campaigns help in organizing and tracking activities.",
  };

  // Fetch campaign names from an API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("https://api.example.com/campaigns");
        setCampaignOptions(response.data.campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Fallback to predefined campaigns if API fails
        setCampaignOptions([
          { id: 1, name: "Campaign A" },
          { id: 2, name: "Campaign B" },
          { id: 3, name: "Campaign C" },
        ]);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validate = () => {
    let newErrors = {};
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.useDID.trim()) {
      newErrors.useDID = "useDID is required";
    } else if (!/^\d{1,12}$/.test(formData.useDID)) {
      newErrors.useDID = "useDID must be a number with up to 12 digits";
    }
    if (!formData.selectuser) newErrors.selectuser = "Please select a user type";
    if (!formData.campaignName) newErrors.campaignName = "Please select a campaign";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.externalNumber.trim()) newErrors.externalNumber = "External Number is required";
    else if (!/^\d+$/.test(formData.externalNumber)) newErrors.externalNumber = "External Number must be numeric";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("userId", formData.userId);
        formDataToSubmit.append("username", formData.username);
        formDataToSubmit.append("useDID", formData.useDID);
        formDataToSubmit.append("selectuser", formData.selectuser);
        formDataToSubmit.append("campaignName", formData.campaignName);
        formDataToSubmit.append("password", formData.password);
        formDataToSubmit.append("externalNumber", formData.externalNumber);
        if (file) formDataToSubmit.append("file", file);

        const response = await axios.post("https://api.example.com/submit-form", formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Form submitted successfully:", response.data);
        setIsSubmitting(false);

        // Reset form fields after successful submission
        setFormData({
          userId: "",
          username: "",
          useDID: "",
          selectuser: "",
          password: "",
          externalNumber: "",
          campaignName: "",
        });
        setFile(null);
      } catch (error) {
        console.error("Error submitting the form:", error);
        setIsSubmitting(false);
      }
    } else {
      console.log("Form has errors");
    }
  };

  // Handle opening the Dialog with specific field details
  const handleOpenDialog = (field) => {
    setCurrentField(field);
    setOpenDialog(true);
  };

  // Handle closing the Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentField("");
  };

  return (
    <div className="newContainer">
      <div className="top">
        <h1>{title}</h1>
      </div>
      <div className="bottom">
        <div className="left">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="Preview"
            className="previewImage"
          />
          <div className="formInput">
            <label htmlFor="file">
              Image: <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit}>
            {/* userId Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="userId">User ID</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("userId")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <input
                type="text"
                id="userId"
                name="userId"
                placeholder="Enter User ID"
                value={formData.userId}
                onChange={handleInputChange}
              />
              {errors.userId && <span className="error">{errors.userId}</span>}
            </div>

            {/* username Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="username">Username</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("username")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>

            {/* useDID Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="useDID">useDID</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("useDID")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <input
                type="text"
                id="useDID"
                name="useDID"
                placeholder="Enter useDID"
                value={formData.useDID}
                onChange={handleInputChange}
              />
              {errors.useDID && <span className="error">{errors.useDID}</span>}
            </div>

            {/* selectuser Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="selectuser">Select User</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("selectuser")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <select
                id="selectuser"
                name="selectuser"
                value={formData.selectuser}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select User Type</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.selectuser && <span className="error">{errors.selectuser}</span>}
            </div>

            {/* password Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="password">Password</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("password")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            {/* externalNumber Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="externalNumber">External Number</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("externalNumber")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <input
                type="text"
                id="externalNumber"
                name="externalNumber"
                placeholder="Enter External Number"
                value={formData.externalNumber}
                onChange={handleInputChange}
              />
              {errors.externalNumber && <span className="error">{errors.externalNumber}</span>}
            </div>

            {/* campaignName Input */}
            <div className="formInput">
              <div className="labelContainer">
                <label htmlFor="campaignName">Campaign Name</label>
                <IconButton
                  aria-label="info"
                  size="small"
                  onClick={() => handleOpenDialog("campaignName")}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <select
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Campaign</option>
                {campaignOptions.map((campaign) => (
                  <option key={campaign.id} value={campaign.name}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              {errors.campaignName && <span className="error">{errors.campaignName}</span>}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Dialog for field information */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentField && currentField.charAt(0).toUpperCase() + currentField.slice(1)}</DialogTitle>
        <DialogContent>
          <Typography>{fieldDetails[currentField]}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default New;
