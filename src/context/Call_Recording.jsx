import React, { useState, useRef, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";

const RecordingPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const getFinalUrl = () => {
    if (!url) return "";

    let parsedUrl = url.endsWith(".wav") ? url : `${url}.wav`;
    const isLocal =
      parsedUrl.includes("192.168.") ||
      parsedUrl.includes("localhost") ||
      parsedUrl.includes("127.0.0.1");

    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;

    try {
      const urlObj = new URL(parsedUrl);
      if (isLocal) {
        urlObj.hostname = currentHost;
        urlObj.protocol = currentProtocol;
        urlObj.port = "";
      }
      return urlObj.toString();
    } catch (e) {
      return parsedUrl;
    }
  };

  const finalUrl = getFinalUrl();

  useEffect(() => {
    const audio = new Audio(finalUrl);
    audioRef.current = audio;

    // Automatically pause / reset when recording ends
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0; // optional: reset to start
    };
    audio.addEventListener("ended", handleEnded);

    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [finalUrl]);

  useEffect(() => {
    // When a new player plays, pause others
    const handleGlobalPlay = (e) => {
      if (e.detail !== audioRef.current && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("audio-play", handleGlobalPlay);

    return () => {
      window.removeEventListener("audio-play", handleGlobalPlay);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onerror = () => {
      alert("Audio file could not be played. Check the .wav file URL or server.");
    };

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Stop other players
      window.dispatchEvent(new CustomEvent("audio-play", { detail: audio }));

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback failed:", err);
          alert("Playback error. Audio format may not be supported.");
        });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(finalUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch the audio file.");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "recording.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Check file URL or permissions.");
    }
  };

  if (!url) return "No Recording";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <IconButton
        color="primary"
        onClick={handlePlayPause}
        style={{
          padding: "4px",
          border: "2px solid #C2185B",
          borderRadius: "6px",
          backgroundColor: "white",
        }}
      >
        <Tooltip title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <PauseIcon style={{ color: "#C2185B", fontSize: "16px" }} />
          ) : (
            <PlayArrowIcon style={{ color: "#C2185B", fontSize: "16px" }} />
          )}
        </Tooltip>
      </IconButton>
      <IconButton
        color="primary"
        onClick={handleDownload}
        style={{
          padding: "4px",
          border: "2px solid #1976d2",
          borderRadius: "6px",
          backgroundColor: "white",
        }}
      >
        <Tooltip title="Download">
          <DownloadIcon style={{ color: "#1976d2", fontSize: "16px" }} />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default RecordingPlayer;
