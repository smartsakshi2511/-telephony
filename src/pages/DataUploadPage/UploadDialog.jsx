import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import { showToast } from "./useToast";
import UploadLeadDialog from "./UploadFile";


export const useLists = (navigate) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`https://${window.location.hostname}:4000/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [navigate]);

  const handleToggleStatus = async (id) => {
    const updated = data.find((d) => d.LIST_ID === id);
    const newStatus = updated.ACTIVE === "active" ? "inactive" : "active";

    setData((prev) =>
      prev.map((i) => (i.LIST_ID === id ? { ...i, ACTIVE: newStatus } : i))
    );

    try {
      await axios.put(
        `https://${window.location.hostname}:4000/statusUpload/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      showToast("success", "Status updated");
    } catch (e) {
      showToast("error", "Failed to update status");
    }
  };
 const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    icon,
    title,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });
};
  const filteredData = data.filter((item) => {
    if (filter === "active" && item.ACTIVE !== "active") return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.LIST_ID && item.LIST_ID.toString().toLowerCase().includes(query)) ||
      (item.NAME && item.NAME.toLowerCase().includes(query)) ||
      (item.CAMPAIGN && item.CAMPAIGN.toLowerCase().includes(query))
    );
  });

 const columns = [
    {
      field: "LIST_ID",
      headerName: "LIST ID",
      flex: 0.5,
      headerClassName: "customHeader",
      renderCell: (params) => (
        <button
          className="listIdButton"
          onClick={() => navigate(`showlist/${params.row.LIST_ID}`)}  
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.row.LIST_ID}
        </button>
      ),
    },
    {
      field: "NAME",
      headerName: "NAME",
      flex: 1,
    },
    {
      field: "DESCRIPTION",
      headerName: "DESCRIPTION",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "LEADS_COUNT",
      headerName: "LEADS COUNT",
      flex: 1,
      headerClassName: "customHeader",
      renderCell: (params) => {
        return (
          <span
            style={{
              color: params.row.LEADS_COUNT != null ? "green" : "black",
            }}
          >
            {params.row.LEADS_COUNT != null
              ? params.row.LEADS_COUNT
              : "Not available"}
          </span>
        );
      },
    },
    {
      field: "CAMPAIGN",
      headerName: "CAMPAIGN",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "ACTIVE",
      headerName: "STATUS",
      width: 180,
      renderCell: (params) => {
        const isActive = params.row.ACTIVE === "active"; // Define isActive here
        return (
          <button
            className={`statusButton ${isActive ? "active" : "inactive"}`}
            onClick={() => handleToggleStatus(params.row.LIST_ID)}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      field: "RTIME",
      headerName: "CREATE TIME",
      flex: 1.5,
      renderCell: (params) => {
        if (!params.value) return "-";
        const utcDate = new Date(params.value);
        const istDate = new Date(
          utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );

        const formattedDate = istDate.toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return formattedDate;
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      renderCell: (params) => (
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
            onClick={() => handleOpenDialog(params.row)}  
            style={{
              padding: "4px",
              border: "2px solid blue",
              borderRadius: "6px 6px",
              backgroundColor: "white",
            }}
          >
            <Tooltip title="Upload">
              <UploadIcon
                style={{
                  cursor: "pointer",
                  color: "blue",
                  fontSize: "12px",
                }}
              />
            </Tooltip>
          </IconButton>

          <UploadLeadDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            listId={listId}
            campaign={campaign}
          />

          <IconButton
            color="info"
            onClick={() => handleEdit(params.row)}
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
            onClick={() => handleDelete(params.row)}
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
      ),
    },
  ];;

  return { data, filteredData, setFilter, searchQuery, setSearchQuery, columns };
};
