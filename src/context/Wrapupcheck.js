import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const WrapupWatcher = () => {
  const [wrapStatus, setWrapStatus] = useState("idle");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const checkWrapup = async () => {
      try {
        const res = await axios.get(
          `https://${window.location.hostname}:4000/agent-wrapup-status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const status = res.data?.status;
        setWrapStatus(status);

        if (status === "wrapup") {
          Swal.fire({
            title: "⏳ You are in Wrap-up Mode",
            text: "Please complete or close wrap-up to continue dialing.",
            icon: "warning",
            confirmButtonText: "Reset Wrapup",
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Reset wrapup
              axios.post(
                `https://${window.location.hostname}:4000/agent-wrapup`,
                { wrapup: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setWrapStatus("idle");
            }
          });
        }
      } catch (err) {
        console.error("Failed to check wrapup:", err);
      }
    };

    const interval = setInterval(checkWrapup, 60000); 
    return () => clearInterval(interval);
  }, [token]);

  return null;  
};

export default WrapupWatcher;
