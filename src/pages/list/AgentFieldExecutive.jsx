import "./list.scss";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { maskNumber, clickToCall } from "../../context/Phoneutils";
import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";
import { IconButton, Tooltip } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import SearchBar from "../../context/searchBar";


const AgentFieldExecutiveList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useContext(AuthContext);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);

  // ✅ Fetch Field Executives
  const fetchFieldExecutives = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/fieldExecutive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("❌ Error fetching Field Executives:", error);
    }
  };

  useEffect(() => {
    fetchFieldExecutives();
  }, []);

  // ✅ Apply search filter
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    return item.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ✅ Table Columns
  const fieldExecColumns = [
    {
      field: "sr",
      headerName: "SR.",
      flex: 0.5,
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      hide: true,
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
    },
    {
      field: "number",
      headerName: "MOBILE",
      flex: 1.5,
      renderCell: (params) => {
        const num = params.value || "";
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* ✅ Masked number */}
            <span style={{ marginRight: "8px" }}>{maskNumber(num)}</span>

            {/* ✅ Click to Call */}
            {num && (
              <Tooltip title="Click to Call">
                <IconButton
                  onClick={() =>
                    clickToCall({
                      number: num,
                      user,
                      updateIframeSrc,
                      toggleIframe,
                    })
                  }
                  color="primary"
                  size="small"
                >
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 1,
    },
  ];

  return (
    <div className="datatable">
      <div
        className="datatableTitle"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <b style={{ fontSize: "1.2rem" }}>FIELD EXECUTIVE LIST</b>

        {/* ✅ Search bar */}
        <SearchBar
          onSearch={(val) => setSearchQuery(val)}
          placeholder="Search name..."
        />
      </div>

      {/* ✅ Paginated Grid */}
      <PaginatedGrid
        rows={filteredData}
        columns={fieldExecColumns}
        getRowId={(row) => row._id || row.id}
      />
    </div>
  );
};

export default AgentFieldExecutiveList;
