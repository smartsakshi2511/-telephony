import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignExtension = ({
  groupDropdownVisible = false,
  setGroupDropdownVisible = () => {},
  groupId = null,
  
  updateAssignedAgents = () => {},
}) => {
  const [agentsList, setAgentsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return; // Only fetch if groupId is valid

    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token is missing.");

        const response = await axios.get(
          `https://${window.location.hostname}:4000/getAgentsExtension/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAgentsList(response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError(err.message || "An error occurred while fetching agents.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [groupId]);

  return (
    <div>
      {groupDropdownVisible && (
        <div
          style={{
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
          <button
            onClick={() => setGroupDropdownVisible(false)} // Close dropdown
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
            X
          </button>
         
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Agent ID</th>
                  <th>Agent Name</th>
                </tr>
              </thead>
              <tbody>
                {agentsList.length > 0 ? (
                  agentsList.map((agent) => (
                    <tr key={agent.agent_id}>
                      <td>{agent.agent_id}</td>
                      <td>{agent.agent_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      {error || "No agents assigned for this group."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         
        </div>
      )}
    </div>
  );
};

export default AssignExtension;
