import "./datatable.scss";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";

const Datatable = () => {
  const [data, setData] = useState(userRows);
  const [editRowId, setEditRowId] = useState(null);
  const [tempData, setTempData] = useState({});

  // Toggle status
  const handleToggleStatus = (id) => {
    const updatedData = data.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "active" ? "inactive" : "active" }
        : item
    );
    setData(updatedData);
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the block.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The block has been deleted.", "success");
      }
    });
  };
  // Start Editing a Row
  const handleEdit = (id) => {
    setEditRowId(id);
    const row = data.find((item) => item.id === id);
    setTempData({ ...row });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleUpdate = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will save the changes you made.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.map((item) => (item.id === id ? tempData : item))); // Save the updated row
        setEditRowId(null); // Exit edit mode
        setTempData({});
        Swal.fire("Updated!", "The record has been updated.", "success");
      }
    });
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditRowId(null);
    setTempData({});
  };

  // Define the action column with icons for view, edit, and delete actions
  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      headerClassName: "customHeader",
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <button
                  className="saveButton"
                  onClick={() => handleUpdate(params.row.id)}
                  style={{
                    backgroundColor: "#4CAF50", // Green background
                    color: "white", // White text
                    padding: "8px 16px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px", // Add space between buttons
                  }}
                >
                  Update
                </button>
                <button
                  className="cancelButton"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#f44336", // Red background
                    color: "white", // White text
                    padding: "8px 16px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px", // Adjust spacing between buttons
                  }}
                >
                  <IconButton
                    color="primary"
                    style={{
                      padding: "4px",
                      border: "2px solid blue", // Border matching icon color
                      borderRadius: "6px 6px", // Rounded corners
                      backgroundColor: "white", // White background
                      height: "24px",
                    }}
                  >
                    <Tooltip title="View">
                      <Link to="/agent/test" style={{ textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <VisibilityIcon
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            fontSize: "12px", // Adjust icon size
                          }}
                        />
                      </Link>
                    </Tooltip>
                  </IconButton>

                  <IconButton
                    color="info"
                    style={{
                      padding: "4px",
                      border: "2px solid green", // Border matching icon color
                      borderRadius: "6px 6px",
                      backgroundColor: "white",
                     
                    }}
                  >
                    <Tooltip title="Edit">
                      <EditIcon
                        style={{
                          cursor: "pointer",
                          color: "green",
                          fontSize: "12px",
                        }}
                        onClick={() => handleEdit(params.row.id)}
                      />
                    </Tooltip>
                  </IconButton>

                  <IconButton
                    color="error"
                    style={{
                      padding: "4px",
                      border: "2px solid red", // Border matching icon color
                      borderRadius: "6px 6px",
                      backgroundColor: "white",
                    }}
                  >
                    <Tooltip title="Delete">
                      <DeleteIcon
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "12px",
                        }}
                        onClick={() => handleDelete(params.row.id)}
                      />
                    </Tooltip>
                  </IconButton>
                </div>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Modify columns to allow editable cells
  const editableColumns = userColumns.map((col) => ({
    ...col,
    renderCell: (params) => {
      const isEditing = params.row.id === editRowId;

      if (isEditing) {
        return (
          <input
            type="text"
            name={col.field}
            value={tempData[col.field] || ""}
            onChange={handleInputChange}
          />
        );
      }
      return params.value;
    },
  }));
  const dataColumns = editableColumns.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        renderCell: (params) => {
          const isActive = params.row.status === "active";
          return (
            <button
              className={`statusButton ${isActive ? "active" : "inactive"}`}
              onClick={() => handleToggleStatus(params.row.id)}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          );
        },
      };
    }
    return col;
  });

  return (
    <div className="datatable">
      <h2
        className="title"
        style={{ color: "#5e6266", fontSize: "25px", fontWeight: "bold" }}
      >
        AGENT LIST
      </h2>
      <div className="datatableTitle">
        <div
          className="datatableTitle"
          style={{ textAlign: "center", margin: "20px 0" }} // Center align and margin for the div
        >
          <Link
            to="/agent/new"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#83cbcf",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, background-color 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#57c7cd")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#83cbcf")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
          >
            Add Agent
          </Link>
        </div>

        <div
          className="datatableTitle"
          style={{ textAlign: "center", margin: "20px 0" }} // Center align and margin for the div
        >
          <Link
            to="/agent/agentBreak"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#c2aacf",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, background-color 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#ad8ac1")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#c2aacf")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
          >
            View Agent Break
          </Link>
        </div>
        <div
          className="datatableTitle"
          style={{ textAlign: "center", margin: "20px 0" }} // Center align and margin for the div
        >
          <Link
            to="/agent/loginReport"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#f3b282",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, background-color 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e3965e")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3b282")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
          >
            Login Report
          </Link>
        </div>

        <div
          className="datatableTitle"
          style={{ textAlign: "center", margin: "20px 0" }} // Center align and margin for the div
        >
          <Link
            to="/agent/agentReport"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#c2aacf",
              color: "white",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, background-color 0.1s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#ad8ac1")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#c2aacf")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
          >
            All Agent Report
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={dataColumns.concat(actionColumn)}
        pageSize={9}
        disableColumnVirtualization
        disableExtendRowFullWidth
        rowsPerPageOptions={[9]}
        style={{ fontSize: "12px" }}
      />
    </div>
  );
};

export default React.memo(Datatable);
