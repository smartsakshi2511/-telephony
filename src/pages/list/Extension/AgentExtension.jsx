import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2"; // <-- Make sure this is imported

const Dropdown = ({
  dropdownVisible,
  setDropdownVisible,
  groupId,
  campaignId,
}) => {
  const [agentsList, setAgentsList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(
          `https://${window.location.hostname}:4000/agentsExtension`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAgentsList(response.data);
      } catch (err) {
        console.error("Error fetching agents:", err.response?.data || err.message);
      }
    };

    fetchAgents();
  }, []);

  const showToast = (icon, message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: icon,
      title: message,
    });
  };

  const handleCheckboxChange = (event, agent) => {
    if (event.target.checked) {
      setSelectedAgent((prev) => [...prev, agent]);
    } else {
      setSelectedAgent((prev) =>
        prev.filter((a) => a.user_id !== agent.user_id)
      );
    }
  };

  const handleAssign = async () => {
    if (selectedAgent.length === 0) {
      showToast("warning", "No agent selected.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");
  
      // Check if agent already assigned
      for (let agent of selectedAgent) {
        const checkResponse = await axios.post(
          `https://${window.location.hostname}:4000/checkAgentAssignment`,
          { groupId, agentId: agent.user_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (checkResponse.data.assigned) {
          showToast("info", `Agent ${agent.full_name} is already assigned to this group.`);
          return;
        }
      }
  
      // Assign agents
      const payload = {
        groupId,
        campaignId,
        agents: selectedAgent.map((agent) => ({
          user_id: agent.user_id,
          full_name: agent.full_name || null,
        })),
      };
  
      await axios.post(
        `https://${window.location.hostname}:4000/assignAgent`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      showToast("success", "Agents assigned successfully!");
      
      // ✅ Close the dropdown after assignment
      setDropdownVisible(false);
  
    } catch (err) {
      console.error(err.message);
      showToast("error", "Error assigning agents.");
    }
  };
  
  return (
    <>
      {dropdownVisible && (
        <Box    
          className="dropdown-menu show"
          sx={{
            position: "absolute",
            top: 40,
            left: "800px",
            overflowY: "auto",
            maxHeight: "300px",
            width: "250px",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 1000,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "14px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <IconButton
            onClick={() => setDropdownVisible(false)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              color: "#1976d2",
              padding: "6px",
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </IconButton>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th></th>
                <th style={{ fontWeight: "bold", paddingBottom: "8px" }}>
                  Agent Name
                </th>
                <th style={{ fontWeight: "bold", paddingBottom: "8px" }}>
                  Agent ID
                </th>
              </tr>
            </thead>
            <tbody>
              {agentsList.map((agent) => (
                <tr
                  key={agent.user_id}
                  style={{ borderBottom: "1px solid #eee", height: "40px" }}
                >
                  <td>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={selectedAgent.some(
                          (a) => a.user_id === agent.user_id
                        )}
                        onChange={(e) => handleCheckboxChange(e, agent)}
                      />
                    </label>
                  </td>
                  <td style={{ padding: "8px" }}>{agent.full_name}</td>
                  <td style={{ padding: "8px" }}>{agent.user_id}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ paddingTop: "12px" }}>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                    }}
                    onClick={handleAssign}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </Box>
      )}
    </>
  );
};

export default Dropdown;
