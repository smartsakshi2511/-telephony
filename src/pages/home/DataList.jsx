import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./home.scss";
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
  Button,
  IconButton,
  Tooltip
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const DataList = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingId, setPlayingId] = useState(null); // To track which recording is playing

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
      recordingUrl: "https://www.example.com/audio1.mp3",
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
      recordingUrl: "https://www.example.com/audio2.mp3",
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
      recordingUrl: "https://www.example.com/audio3.mp3",
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
        setData(fallbackData);
        setLoading(false);
      });
  }, [type]);

  // Export to Excel function
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${type}_data.xlsx`);
  };

  // Play/Pause audio
  const handlePlayPause = (recordingUrl, id) => {
    const audio = document.getElementById(`audio-${id}`);
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null); // Stop tracking playing audio
    } else {
      if (playingId) {
        // Pause any previously playing audio
        const prevAudio = document.getElementById(`audio-${playingId}`);
        if (prevAudio) prevAudio.pause();
      }
      audio.play();
      setPlayingId(id); // Track the currently playing audio
    }
  };

  // Download audio
  const handleDownload = async (recordingUrl, id) => {
    try {
      // Fetch the audio file
      const response = await fetch(recordingUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the recording");
      }
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `recording-${id}.mp3`; // Naming the file with the ID
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading recording:", error);
      alert("Error downloading the recording. Please try again.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {type.toUpperCase()}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleExport} style={{
                background: "linear-gradient(90deg, #4caf50, #2e7d32)", // Green gradient
                color: "white",
                borderColor: "#4caf50",
              }}>
          Export <DownloadIcon />
        </Button>
      </div>
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
              <TableCell>Recording</TableCell>
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
                  <audio id={`audio-${item.id}`} src={item.recordingUrl} />
                  <div  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px", // Adjust spacing between buttons
                  }}>
                  <IconButton
                    color="primary"
                    onClick={() => handlePlayPause(item.recordingUrl, item.id)}
                    style={{
                      padding: "4px",
                      border: "2px solid #C2185B", // Border matching icon color
                      borderRadius: "6px 6px",
                      backgroundColor: "white",
                    }}
                  >
                    <Tooltip title={playingId === item.id ? "Pause" : "Play"}>
                      {playingId === item.id ? (
                        <PauseIcon
                          style={{
                            cursor: "pointer",
                            color: "#C2185B",
                            fontSize: "12px",
                          }}
                        />
                      ) : (
                        <PlayArrowIcon
                          style={{
                            cursor: "pointer",
                            color: "#C2185B",
                            fontSize: "12px",
                          }}
                        />
                      )}
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(item.recordingUrl, item.id)}
                    style={{
                      padding: "4px",
                      border: "2px solid #1976d2", // Border matching icon color
                      borderRadius: "6px 6px",
                      backgroundColor: "white",
                    }}
                  >
                    <Tooltip title="Download">
                      <DownloadIcon
                        style={{
                          cursor: "pointer",
                          color: "#1976d2",
                          fontSize: "12px",
                        }}
                      />
                    </Tooltip>
                  </IconButton>
                  </div>
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
