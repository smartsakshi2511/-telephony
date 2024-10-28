import "./N.scss";
 
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

const AddUserForm = () => {
  return (
    <div className="form-container">
      <h1>Add New User</h1>
      <form className="add-user-form">
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="userID">User ID</label>
            <input type="text" id="userID" placeholder="Enter User ID" />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter Username" />
          </div>
          <div className="form-group">
            <label htmlFor="useDID">useDID</label>
            <input type="text" id="useDID" placeholder="Enter useDID" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter Password" />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label htmlFor="userType">Select User Type</label>
            <select id="userType">
              <option>Select User Type</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="externalNumber">External Number</label>
            <input type="text" id="externalNumber" placeholder="Enter External Number" />
          </div>
          <div className="form-group">
            <label htmlFor="campaign">Campaign Name</label>
            <select id="campaign">
              <option>Select Campaign</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="imageUpload">Image</label>
            <input type="file" id="imageUpload" />
          </div>
        </div>

       
      </form>
      <div className="submit-section">
          <button type="submit">Submit</button>
        </div>
    </div>
  );
};

export default AddUserForm;
