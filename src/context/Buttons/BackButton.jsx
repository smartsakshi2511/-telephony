import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
 // Adjust path as needed
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  

  const handleBack = () => {
    if (!user || !user.user_type) return;

    let path = "/";
    if (user.user_type == 8) path = "/admin";
    else if (user.user_type == 9) path = "/superadmin";
    else if (user.user_type == 7) path = "/manager";
    else if (user.user_type == 6) path = "/quality_analyst";
    else if (user.user_type == 2) path = "/team_leader";
    else if (user.user_type == 1) path = "/agent";
    else if (user.user_type == 5) path = "/it";

    navigate(path);
  };

  return (
    <IconButton onClick={handleBack} color="primary">
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
