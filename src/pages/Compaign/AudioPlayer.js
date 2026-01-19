import React, { useState, useRef, useEffect } from "react";
import { IconButton, Tooltip, Snackbar, Alert, Box } from "@mui/material";
import { PlayArrow, Pause, ErrorOutline } from "@mui/icons-material";


const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      
      if (window.currentlyPlayingAudio && window.currentlyPlayingAudio !== audioRef.current) {
        window.currentlyPlayingAudio.pause();
        window.currentlyPlayingAudio.currentTime = 0; // Reset playback position
      }

      window.currentlyPlayingAudio = audioRef.current; // Update global reference

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          setError("Failed to play: " + err.message);
          setShowError(true);
          console.error("Error playing audio:", err);
        });
    }
  };

  useEffect(() => {
 
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <Box p={1}>
      <audio ref={audioRef} src={audioUrl} />
      <Tooltip title={isPlaying ? "Pause" : "Play"}>
        <IconButton
          onClick={handlePlayPause}
          color="primary"
          style={{
            padding: "4px",
            border: "2px solid #C2185B",
            borderRadius: "50px",
            backgroundColor: "white",
          }}
        >
          {isPlaying ? (
            <Pause style={{ fontSize: "12px", color: "#C2185B" }} />
          ) : (
            <PlayArrow style={{ fontSize: "12px", color: "#C2185B" }} />
          )}
        </IconButton>
      </Tooltip>
      {showError && (
        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowError(false)}
            severity="error"
            variant="filled"
            icon={<ErrorOutline />}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AudioPlayer;
