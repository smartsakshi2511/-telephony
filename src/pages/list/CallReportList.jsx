import React, { useState, useEffect } from "react";
import "./list.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
 
  Button,
 
  Tooltip,
 
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from "@mui/icons-material";

const CallReportList = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [data, setData] = useState([]);
  const [playingAudio, setPlayingAudio] = useState(null); // To track the playing audio
  const [audioInstance, setAudioInstance] = useState(null); // To manage audio playback

  // Columns definition
  const columns = [
    { field: "sr", headerName: "SR", flex: 0.5, headerClassName: "customHeader" },
    { field: "agentName", headerName: "AGENT NAME", flex: 1.5, headerClassName: "customHeader" },
    { field: "agentId", headerName: "AGENT ID", flex: 1, headerClassName: "customHeader" },
    { field: "callFrom", headerName: "CALL FROM", flex: 1.5, headerClassName: "customHeader" },
    { field: "callTo", headerName: "CALL TO", flex: 1.5, headerClassName: "customHeader" },
    { field: "campaignName", headerName: "CAMPAIGN NAME", flex: 1.5, headerClassName: "customHeader" },
    { field: "startTime", headerName: "START TIME", flex: 2.5, headerClassName: "customHeader" },
    { field: "duration", headerName: "DURATION", flex: 1.5, headerClassName: "customHeader" },
    { field: "direction", headerName: "DIRECTION", flex: 1, headerClassName: "customHeader" },
    { field: "status", headerName: "STATUS", flex: 1, headerClassName: "customHeader" },
    { field: "hangup", headerName: "HANGUP", flex: 1, headerClassName: "customHeader" },
    {
      field: "recording",
      headerName: "Recording",
      flex: 1.5,
      renderCell: (params) => {
        const isPlaying = playingAudio === params.row.sr;
        return (
          <IconButton
            onClick={() => handleAudioToggle(params.row.sr, params.value)}
            color="primary"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
        );
      },
    },
  ];

  // Fetch data
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get("https://api.example.com/calls");
        setData(response.data.calls);
      } catch (error) {
        console.error("Error fetching calls:", error);
        // Default data for testing
        setData([
          {
            sr: 1,
            agentName: "John Doe",
            agentId: "A001",
            callFrom: "+1234567890",
            callTo: "+0987654321",
            campaignName: "Campaign X",
            startTime: "2023-08-01 10:00 AM",
            duration: "00:05:30",
            direction: "Inbound",
            status: "Completed",
            hangup: "Yes",
            recording: "https://example.com/recording1.mp3",
          },
        ]);
      }
    };
    fetchCalls();
  }, []);

  // Handle audio play/pause
  const handleAudioToggle = (sr, audioUrl) => {
    if (playingAudio === sr) {
      // Pause the audio
      audioInstance.pause();
      setPlayingAudio(null);
    } else {
      // Play the audio
      const newAudio = new Audio(audioUrl);
      if (audioInstance) audioInstance.pause(); // Pause the currently playing audio
      setAudioInstance(newAudio);
      setPlayingAudio(sr);
      newAudio.play();
    }
  };

  // Handle download as Excel
  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data available to download.");
      return;
    }
    const excelData = data.map((item) => ({
      SR: item.sr,
      "Agent Name": item.agentName,
      "Agent ID": item.agentId,
      "Call From": item.callFrom,
      "Call To": item.callTo,
      "Campaign Name": item.campaignName,
      "Start Time": item.startTime,
      Duration: item.duration,
      Direction: item.direction,
      Status: item.status,
      Hangup: item.hangup,
      Recording: item.recording,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "call_data.xlsx");
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>TOTAL CALL REPORTS</b>
        <div className="callFilter">
          <Button
            variant="outlined"
            onClick={() => {}}
            endIcon={<FilterListIcon />}
            sx={{ marginRight: "10px" }}
          >
            Filter
          </Button>
          <Tooltip title="Download Data">
            <Button
              variant="outlined"
              onClick={handleDownload}
              sx={{
                background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                color: "white",
              }}
            >
              Export <DownloadIcon />
            </Button>
          </Tooltip>
        </div>
      </div>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.sr}
        disableSelectionOnClick
      />
    </div>
  );
};

export default CallReportList;
