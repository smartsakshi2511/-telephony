import React, { useEffect, useState } from "react";
import axios from "axios";
import "./widget.scss";
import {
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  CallEnd as CallEndIcon,
  Queue as QueueIcon,
  SupervisorAccount as SupervisorAccountIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PhoneInTalk as PhoneInTalkIcon,
  PersonOutlined as PersonOutlinedIcon,
} from "@mui/icons-material";

const Widget = ({ type, onClick }) => {
  const [callCounts, setCallCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    axios
      .get(`https://${window.location.hostname}:4000/call-counts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCallCounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching call counts:", err);
        setLoading(false);
      });
  }, []);

const data = {
  totalCall: { title: "Total Call", icon: <PersonOutlinedIcon />, color: "#ffb74d" },        // medium orange
  answerCall: { title: "Answer Call", icon: <CallReceivedIcon />, color: "#81c784" },       // medium green
  cancelCall: { title: "Cancel Call", icon: <CallEndIcon />, color: "#e57373" },            // medium red
  callQueue: { title: "Call Queue", icon: <QueueIcon />, color: "#ba68c8" },                // medium purple
  otherCall: { title: "Other Call", icon: <PhoneInTalkIcon />, color: "#4dd0e1" },          // medium cyan
  outboundCall: { title: "Outbound Call", icon: <CallMadeIcon />, color: "#7986cb" },       // medium indigo
  inboundCall: { title: "Inbound Call", icon: <CallReceivedIcon />, color: "#aed581" },     // medium lime-green
  noAnswerCall: { title: "No Answer Call", icon: <CallMissedIcon />, color: "#ff8a65" },    // medium deep orange
  loginAgent: { title: "Login Agent", icon: <SupervisorAccountIcon />, color: "#9575cd" },  // medium lavender
  availableAgent: { title: "Available Agent", icon: <SupervisorAccountIcon />, color: "#4db6ac" }, // medium teal
  pauseAgent: { title: "Pause Agent", icon: <PauseCircleOutlineIcon />, color: "#bdbdbd" }, // medium grey
  inCall: { title: "In Call", icon: <PhoneInTalkIcon />, color: "#4fc3f7" },                // medium sky blue
};



  const widgetData = data[type] || { title: "Invalid Type", icon: null, color: "#ccc" };
  const value = loading ? "..." : callCounts[type] || 0;

  return (
      <div className="material-widget" onClick={onClick}>
    <div className="widget-content">
      <div className="widget-value">{value}</div>
      <div className="widget-title">{widgetData.title}</div>
    </div>
    <div className="widget-icon" style={{ color: widgetData.color }}>
      {widgetData.icon}
    </div>
    <div className="bottom-border" style={{ backgroundColor: widgetData.color }} />
  </div>
  );
};

export default Widget;
