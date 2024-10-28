import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";
import { useState } from "react";
// Import Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, IconButton } from "@mui/material";



const Datatable = () => {
  const [data, setData] = useState(userRows);
  const [editRowId, setEditRowId] = useState(null); // For tracking which row is being edited
  const [tempData, setTempData] = useState({}); // For holding data during edit mode

 // Handle Delete with SweetAlert confirmation
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
    setTempData({ ...row }); // Copy the row's current data into tempData
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

 // Save Edited Row with SweetAlert confirmation
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
    setEditRowId(null); // Exit edit mode
    setTempData({});
  };

  // Define the action column with icons for view, edit, and delete actions
  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
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
               <Tooltip title="View">
                <Link to="/agent/test" style={{ textDecoration: "none" }}>
                  <VisibilityIcon className="icon" style={{ cursor: "pointer", color: "blue", marginRight: "10px" }} />
                </Link>
                </Tooltip>

                <Tooltip title="Edit">
                <EditIcon
                  className="icon"
                  style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
                  onClick={() => handleEdit(params.row.id)}
                />
                 </Tooltip>

                 <Tooltip title="Delete">
                <DeleteIcon
                  className="icon"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(params.row.id)}
                />
                </Tooltip>
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

  return (
    <div className="datatable">
    <h2 className="title" style={{ color: '#5e6266', fontSize: '24px', fontWeight: 'bold'}}>ADD NEW USER</h2>
      <div className="datatableTitle">
      
        <div 
  className="datatableTitle" 
  style={{ textAlign: 'center', margin: '20px 0' }} // Center align and margin for the div
>
  <Link
    to="/agent/new"
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#83cbcf',
      color: 'white',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, background-color 0.3s',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#57c7cd'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#83cbcf'}
    onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
  >
    Add Agent
  </Link>
</div>

<div 
  className="datatableTitle" 
  style={{ textAlign: 'center', margin: '20px 0' }} // Center align and margin for the div
>
  <Link
    to="/agent/agentBreak"
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#c2aacf',
      color: 'white',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, background-color 0.3s',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ad8ac1'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c2aacf'}
    onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
  >
   View Agent Break
  </Link>
</div>
<div 
  className="datatableTitle" 
  style={{ textAlign: 'center', margin: '20px 0' }} // Center align and margin for the div
>
  <Link
    to="/agent/loginReport"
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#f3b282',
      color: 'white',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, background-color 0.3s',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e3965e'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3b282'}
    onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
  >
    Login Report
  </Link>
</div>

<div 
  className="datatableTitle" 
  style={{ textAlign: 'center', margin: '20px 0' }} // Center align and margin for the div
>
  <Link
    to="/agent/agentReport"
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#c2aacf',
      color: 'white',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, background-color 0.1s',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ad8ac1'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c2aacf'}
    onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
  >
    All Agent Report
  </Link>
</div>

      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={editableColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
