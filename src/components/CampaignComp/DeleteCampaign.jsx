// src/components/DeleteAction/DeleteAction.jsx
import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteAction = ({ id, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      onDelete(id);
    }
  };

  return (
    <Tooltip title="Delete">
      <IconButton color="error" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

DeleteAction.propTypes = {
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteAction;

