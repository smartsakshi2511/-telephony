import "./chart.scss";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("adminId"); // set this during login
        const response = await axios.get(
          `https://${window.location.hostname}:4000/chart-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Transform API result into chart format
        setData([
          {
            name: "Dial Status",
            interested: response.data.interested,
            not_interested: response.data.not_interested,
          },
        ]);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="chart">
      <div className="chart-header">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#607D8B" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
          <Line type="monotone" dataKey="interested" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="not_interested" stroke="#F44336" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
