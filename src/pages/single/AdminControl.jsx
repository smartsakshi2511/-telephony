import { useEffect, useState } from "react";
import axios from "axios";
import "./single.scss";

export const UserPermissionsEditor = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [permissions, setPermissions] = useState({
    agent_management: false,
    campaign: false,
    data_upload: false,
    report_view: false,
    ivr_converter: false,
    disposition: false,
    block_no: false,
    dtmf: false,
    group: false,
    lead_form_type: "Travel Package Form", 
  });

  useEffect(() => {
    const token = localStorage.getItem("token");  

    axios
      .get(`https://${window.location.hostname}:4000/telephony/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const adminList = res.data;
        setAdmins(adminList);
        if (adminList.length > 0) {
          setSelectedAdmin(String(adminList[0].admin));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch admins:", err);
      });
  }, []);

  useEffect(() => {
    if (!selectedAdmin) return;
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://${window.location.hostname}:4000/permissions/${selectedAdmin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPermissions(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch permissions:", err);
        setPermissions({
          agent_management: false,
          campaign: false,
          data_upload: false,
          report_view: false,
          ivr_converter: false,
          disposition: false,
          block_no: false,
          dtmf: false,
          group: false,
          lead_form_type: "Travel Package Form", 
        });
      });
  }, [selectedAdmin]);

  const handleCheckboxChange = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `https://${window.location.hostname}:4000/permissions/${selectedAdmin}`,
        permissions,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => alert("Permissions saved!"))
      .catch((err) => {
        console.error("Save error:", err);
        alert("Failed to save permissions.");
      });
  };

  return (
    <div className="permissions-page-wrapper">
      <div className="permissions-container">
        <h1 className="permissions-title">Admin Permissions</h1>

        <label className="label">
          Select Admin
          <select
            className="select-box"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
          >
            {admins.map((admin) => (
              <option key={admin.admin} value={String(admin.admin)}>
                {admin.admin}
              </option>
            ))}
          </select>
        </label>

        <div className="permissions-section">
          <h2 className="permissions-subtitle">
            Set Permissions for{" "}
            {admins.find((a) => String(a.admin) === selectedAdmin)?.full_name ||
              ""}
          </h2>

          <div className="permissions-grid">
            {[
              { key: "agent_management", label: "Agent Management" },
              { key: "campaign", label: "Campaign" },
              { key: "data_upload", label: "Data Upload" },
              { key: "report_view", label: "Report View" },
              { key: "ivr_converter", label: "IVR Converter" },
              { key: "disposition", label: " Disposition" },
              { key: "block_no", label: "Block No" },
              { key: "dtmf", label: "DTMF" },
              { key: "group", label: "Group" },
            ].map((perm) => (
              <label key={perm.key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={permissions[perm.key]}
                  onChange={() => handleCheckboxChange(perm.key)}
                />
                <span>{perm.label}</span>
              </label>
            ))}
           <div className="dropdown-field">
            <label className="label">
              Select Lead Form
              <select
                className="select-box"
                value={permissions.lead_form_type}
                onChange={(e) =>
                  setPermissions((prev) => ({
                    ...prev,
                    lead_form_type: e.target.value,
                  }))
                }
              >
                <option value="Travel Package Form">Travel Package Form</option>
                <option value="Product Demo">Product Demo</option>
                <option value="Education">Education</option>
              </select>
            </label>
          </div>
          </div>

        </div>

        <button className="save-button" onClick={handleSave}>
          Save Permissions
        </button>
      </div>
    </div>
  );
};
