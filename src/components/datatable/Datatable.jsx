import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";

// Import Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Datatable = () => {
  const [data, setData] = useState(userRows);
  const [editRowId, setEditRowId] = useState(null); // For tracking which row is being edited
  const [tempData, setTempData] = useState({}); // For holding data during edit mode

  // Handle Delete
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
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

  // Save Edited Row
  const handleSave = (id) => {
    setData(data.map((item) => (item.id === id ? tempData : item))); // Save the updated row
    setEditRowId(null); // Exit edit mode
    setTempData({});
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
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <button className="saveButton" onClick={() => handleSave(params.row.id)}>
                  Save
                </button>
                <button className="cancelButton" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Link to="/users/test" style={{ textDecoration: "none" }}>
                  <VisibilityIcon className="icon" style={{ cursor: "pointer", color: "blue", marginRight: "10px" }} />
                </Link>
                <EditIcon
                  className="icon"
                  style={{ cursor: "pointer", color: "green", marginRight: "10px" }}
                  onClick={() => handleEdit(params.row.id)}
                />
                <DeleteIcon
                  className="icon"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(params.row.id)}
                />
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
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
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
