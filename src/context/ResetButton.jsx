 
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Swal from "sweetalert2";
import axios from "axios";

const ResetButton = ({ onAfterReset }) => {
  const handleEmergencyReset = async () => {
    Swal.fire({
      title: "⚠️ Emergency Reset",
      text: "This will log out ALL agents and clear live reports. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reset everything!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const loggedInUser = JSON.parse(localStorage.getItem("user"));

          const response = await axios.post(
            `https://${window.location.hostname}:4000/telephony/emergencyReset`,
            { superadmin_id: loggedInUser.user_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          Swal.fire({
            icon: "success",
            title: "Emergency Reset Complete",
            text: response.data.message,
          });

          // call back to parent if needed
          if (onAfterReset) onAfterReset();
        } catch (error) {
          console.error("Emergency reset failed:", error);
          Swal.fire({
            icon: "error",
            title: "Reset Failed",
            text: error.response?.data?.message || "Server error",
          });
        }
      }
    });
  };

  return (
    <Button
      sx={{
        background: "linear-gradient(90deg, #b71c1c, #f44336)",
        color: "#fff",
        "&:hover": { background: "linear-gradient(90deg, #7f0000, #d32f2f)" },
      }}
      startIcon={<ExitToAppIcon />}
      onClick={handleEmergencyReset}
    >
    Reset
    </Button>
  );
};

export default ResetButton;
