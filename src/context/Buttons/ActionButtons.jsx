import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ActionButtons = ({ onView, onEdit, onDelete }) => {
  return (
    <div
      className="cellAction"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <IconButton
        color="primary"
        onClick={onView}
        style={{
          padding: "4px",
          border: "2px solid blue",
          borderRadius: "6px 6px",
          backgroundColor: "white",
        }}
      >
        <Tooltip title="View">
          <VisibilityIcon
            style={{
              cursor: "pointer",
              color: "blue",
              fontSize: "12px",
            }}
          />
        </Tooltip>
      </IconButton>

      <IconButton
        color="info"
        onClick={onEdit}
        style={{
          padding: "4px",
          border: "2px solid green",
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
          />
        </Tooltip>
      </IconButton>

      <IconButton
        color="error"
        onClick={onDelete}
        style={{
          padding: "4px",
          border: "2px solid red",
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
          />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default ActionButtons;
