import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
 


import "./home.scss"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

const DataList = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback data to show when the API fetch fails
  const fallbackData = [
    {
      id: 1,
      callFrom: "918800831079",
      number: "9991",
      startTime: "2024-10-22-14:23:13",
      endTime: "2024-10-22-08:53:17",
      duration: "00:00:04",
      status: "ANSWER",
      hangup: "CLIENT",
      direction: "inbound",
      recordingUrl: "#",
    },
    {
      id: 2,
      callFrom: "918800831079",
      number: "9991",
      startTime: "2024-10-22-14:21:43",
      endTime: "2024-10-22-08:51:54",
      duration: "00:00:11",
      status: "ANSWER",
      hangup: "CLIENT",
      direction: "inbound",
      recordingUrl: "#",
    },
    {
      id: 3,
      callFrom: "918800831079",
      number: "9991",
      startTime: "2024-10-22-14:20:58",
      endTime: "2024-10-22-08:51:17",
      duration: "00:00:00",
      status: "CANCEL",
      hangup: "CLIENT",
      direction: "inbound",
      recordingUrl: "#",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`https://api.example.com/data?type=${type}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setData(fallbackData); // Use fallback data if fetch fails
        setLoading(false);
      });
  }, [type]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {type.toUpperCase()}
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} className="">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Call From</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hangup</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Recording URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.callFrom}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.startTime}</TableCell>
                <TableCell>{item.endTime}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.hangup}</TableCell>
                <TableCell>{item.direction}</TableCell>
                <TableCell>
                  <a href={item.recordingUrl} target="_blank" rel="noopener noreferrer">
                    Recording
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataList;
