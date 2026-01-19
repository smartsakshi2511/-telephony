import "./featured.scss"; 
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

const ViewagentFeatured = ({ userId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!userId) {
          throw new Error("User ID is missing.");
        }
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/Agentfeature/${userId}/${filter}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = [
          { name: "Answer Call", value: response.data.answerCall },
          { name: "Cancel Call", value: response.data.cancelCall },
          { name: "Other Call", value: response.data.otherCall },
          { name: "Total Call", value: response.data.totalCall }
        ];

        setChartData(data);
      } catch (err) {
        setError("Failed to fetch chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, filter]);

  const handleMenuClick = (filter) => {
    setFilter(filter);
    setAnchorEl(null);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Status</h1>
        <div>
          <IconButton onClick={handleClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: { maxHeight: 200 },
            }}
          >
            <MenuItem onClick={() => handleMenuClick("all")}>All</MenuItem>
            <MenuItem onClick={() => handleMenuClick("today")}>Today</MenuItem>
            <MenuItem onClick={() => handleMenuClick("weekly")}>Weekly</MenuItem>
            <MenuItem onClick={() => handleMenuClick("monthly")}>Monthly</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="bottom">
        {loading ? (
          <p>Loading chart...</p>
        ) : error ? (
          <p>{error}</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}  // Outer radius of the donut
                innerRadius={60}  // Inner radius for the donut effect
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}  // Outer radius of the donut
                innerRadius={60}  // Inner radius for the donut effect
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Answer Call</div>
            <div className="itemValue">
              {chartData.find((d) => d.name === "Answer Call")?.value || 0}
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Cancel Call</div>
            <div className="itemValue">
              {chartData.find((d) => d.name === "Cancel Call")?.value || 0}
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Other Call</div>
            <div className="itemValue">
              {chartData.find((d) => d.name === "Other Call")?.value || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewagentFeatured;
