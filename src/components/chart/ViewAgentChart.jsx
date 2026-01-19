import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ViewagentChart = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch data from the backend
        const response = await axios.get(`https://${window.location.hostname}:4000/telephony/agent-chart-data/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("API Response Data:", response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Error fetching chart data');
        setLoading(false);
      }
    };

    fetchChartData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data.length) return <div>No data available for this agent for the last 6 months.</div>;

  return (
    <div style={{ 
      background: "#fff", 
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
      // borderRadius: "8px", 
      padding: "20px", 
      margin: "35px",
      width: "80%",
      maxWidth: "800px"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Call Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="answerCall" stroke="#8884d8" />
          <Line type="monotone" dataKey="cancelCall" stroke="#82ca9d" />
          <Line type="monotone" dataKey="otherCall" stroke="#ffc658" />
          <Line type="monotone" dataKey="outboundCall" stroke="#ff7300" />
          <Line type="monotone" dataKey="inboundCall" stroke="#00bfae" />
          <Line type="monotone" dataKey="totalCall" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewagentChart;
