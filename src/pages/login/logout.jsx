import { useContext } from "react";
import { AuthContext } from "../../context/authContext"; 
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Logout = () => {
  const { logout, user } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
       
      await axios.post(`https://${window.location.hostname}:4000/log/logout`, { user_id: user.user_id });
 
      logout();
 
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
    Logout
    </>
  )
};

export default Logout;
