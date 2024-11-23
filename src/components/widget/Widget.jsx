import React from "react";
import "./widget.scss";
import {
  PersonOutlined as PersonOutlinedIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  CallEnd as CallEndIcon,
  Queue as QueueIcon,
  SupervisorAccount as SupervisorAccountIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PhoneInTalk as PhoneInTalkIcon,
} from "@mui/icons-material";

const Widget = ({ type, onClick }) => {
  const amount = 100;

  // Array of gradients for widgets
  const gradients = [
    "linear-gradient(90deg, #283593, #3F51B5)",  
    "linear-gradient(90deg, #1E88E5, #42A5F5)", // Blue for answerCall
    "linear-gradient(90deg, #D32F2F, #F44336)", // Red for cancelCall
    "linear-gradient(90deg, #8E24AA, #BA68C8)", // Purple for callQueue
    "linear-gradient(90deg, #FB8C00, #FFB74D)", // Orange for otherCall
    "linear-gradient(90deg, #00796B, #48A999)", // Teal for outboundCall
    "linear-gradient(90deg, #388E3C, #66BB6A)", // Green for inboundCall
    "linear-gradient(90deg, #C2185B, #E91E63)", // Pink for noAnswerCall
    "linear-gradient(90deg, #303F9F, #5C6BC0)", // Dark Blue for loginAgent
    "linear-gradient(90deg, #43A047, #81C784)", // Light Green for availableAgent
    "linear-gradient(90deg, #FF6F00, #FFA726)", // Amber for pauseAgent
    "linear-gradient(90deg, #1565C0, #64B5F6)", // Bright Blue for inCall

    // "linear-gradient(90deg, #5C6BC0, #7986CB)", // Lighter Blue
    // "linear-gradient(90deg, #64B5F6, #BBDEFB)", // Lighter Blue for answerCall
    // "linear-gradient(90deg, #EF5350, #FFCDD2)", // Lighter Red for cancelCall
    // "linear-gradient(90deg, #CE93D8, #E1BEE7)", // Lighter Purple for callQueue
    // "linear-gradient(90deg, #FFCC80, #FFE0B2)", // Lighter Orange for otherCall
    // "linear-gradient(90deg, #80CBC4, #B2DFDB)", // Lighter Teal for outboundCall
    // "linear-gradient(90deg, #A5D6A7, #C8E6C9)", // Lighter Green for inboundCall
    // "linear-gradient(90deg, #F48FB1, #F8BBD0)", // Lighter Pink for noAnswerCall
    // "linear-gradient(90deg, #7986CB, #C5CAE9)", // Lighter Dark Blue for loginAgent
    // "linear-gradient(90deg, #A5D6A7, #DCEDC8)", // Lighter Light Green for availableAgent
    // "linear-gradient(90deg, #FFB74D, #FFE0B2)", // Lighter Amber for pauseAgent
    // "linear-gradient(90deg, #64B5F6, #BBDEFB)" 
  ];

  // Data for widgets
  const data = {
    totalCall: {
      title: "TOTAL CALL",
      icon: (
        <PersonOutlinedIcon
          className="icon"
          style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
        />
      ),
      link: "See all calls",
    },
    answerCall: {
      title: "ANSWER CALL",
      icon: (
        <CallReceivedIcon
          className="icon"
          style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }}
        />
      ),
      link: "View answered calls",
    },
    cancelCall: {
      title: "CANCEL CALL",
      icon: (
        <CallEndIcon
          className="icon"
          style={{ color: "darkred", backgroundColor: "rgba(128, 0, 0, 0.2)" }}
        />
      ),
      link: "View cancelled calls",
    },
    callQueue: {
      title: "CALL QUEUE",
      icon: (
        <QueueIcon
          className="icon"
          style={{ color: "purple", backgroundColor: "rgba(128, 0, 128, 0.2)" }}
        />
      ),
      link: "See call queue",
    },
    otherCall: {
      title: "OTHER CALL",
      icon: (
        <PhoneInTalkIcon
          className="icon"
          style={{ color: "orange", backgroundColor: "rgba(255, 165, 0, 0.2)" }}
        />
      ),
      link: "See other calls",
    },
    outboundCall: {
      title: "OUTBOUND CALL",
      icon: (
        <CallMadeIcon
          className="icon"
          style={{ color: "blue", backgroundColor: "rgba(0, 0, 255, 0.2)" }}
        />
      ),
      link: "View outbound calls",
    },
    inboundCall: {
      title: "INBOUND CALL",
      icon: (
        <CallReceivedIcon
          className="icon"
          style={{ color: "darkgreen", backgroundColor: "rgba(0, 128, 0, 0.2)" }}
        />
      ),
      link: "View inbound calls",
    },
    noAnswerCall: {
      title: "NO ANSWER CALL",
      icon: (
        <CallMissedIcon
          className="icon"
          style={{ color: "red", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
        />
      ),
      link: "View unanswered calls",
    },
    loginAgent: {
      title: "LOGIN AGENT",
      icon: (
        <SupervisorAccountIcon
          className="icon"
          style={{ color: "navy", backgroundColor: "rgba(0, 0, 128, 0.2)" }}
        />
      ),
      link: "View login agents",
    },
    availableAgent: {
      title: "AVAILABLE AGENT",
      icon: (
        <SupervisorAccountIcon
          className="icon"
          style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }}
        />
      ),
      link: "View available agents",
    },
    pauseAgent: {
      title: "PAUSE AGENT",
      icon: (
        <PauseCircleOutlineIcon
          className="icon"
          style={{
            color: "orange",
            backgroundColor: "rgba(255, 165, 0, 0.2)",
          }}
        />
      ),
      link: "View paused agents",
    },
    inCall: {
      title: "IN CALL",
      icon: (
        <PhoneInTalkIcon
          className="icon"
          style={{
            color: "dodgerblue",
            backgroundColor: "rgba(30, 144, 255, 0.2)",
          }}
        />
      ),
      link: "See details of in-call agents",
    },
  };

  // Widget data
  const widgetData = data[type];
  const gradientStyle = gradients[Object.keys(data).indexOf(type)];

  return (
    <div
      className="widget"
      onClick={onClick}
      style={{ background: gradientStyle }}
    >
      <div className="left">
        <span className="title">{widgetData.title}</span>
        <span className="counter">{`${amount}`}</span>
        {/* <div className="percentage positive">{`${amount}`}</div> */}
      </div>
      <div className="right">
      
        {widgetData.icon}
      </div>
    </div>
  );
};

export default Widget;
