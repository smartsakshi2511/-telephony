import React from "react";
import "./widget.scss";
import { 
  KeyboardArrowUp as KeyboardArrowUpIcon, 
  PersonOutlined as PersonOutlinedIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  CallEnd as CallEndIcon,
  Queue as QueueIcon,
  SupervisorAccount as SupervisorAccountIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
  PhoneInTalk as PhoneInTalkIcon
} from "@mui/icons-material";

const Widget = ({ type, onClick }) => {
  const amount = 100;
 

  const data = {
    totalCall: {
      title: "TOTAL CALL",
      icon: <PersonOutlinedIcon className="icon" style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }} />,
      isMoney: false,
      link: "See all calls"
    },
    answerCall: {
      title: "ANSWER CALL",
      icon: <CallReceivedIcon className="icon" style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }} />,
      isMoney: false,
      link: "View answered calls"
    },
    cancelCall: {
      title: "CANCEL CALL",
      icon: <CallEndIcon className="icon" style={{ color: "darkred", backgroundColor: "rgba(128, 0, 0, 0.2)" }} />,
      isMoney: false,
      link: "View cancelled calls"
    },
    callQueue: {
      title: "CALL QUEUE",
      icon: <QueueIcon className="icon" style={{ color: "purple", backgroundColor: "rgba(128, 0, 128, 0.2)" }} />,
      isMoney: false,
      link: "See call queue"
    },
    otherCall: {
      title: "OTHER CALL",
      icon: <PhoneInTalkIcon className="icon" style={{ color: "orange", backgroundColor: "rgba(255, 165, 0, 0.2)" }} />,
      isMoney: false,
      link: "See other calls"
    },
    outboundCall: {
      title: "OUTBOUND CALL",
      icon: <CallMadeIcon className="icon" style={{ color: "blue", backgroundColor: "rgba(0, 0, 255, 0.2)" }} />,
      isMoney: false,
      link: "View outbound calls"
    },
    inboundCall: {
      title: "INBOUND CALL",
      icon: <CallReceivedIcon className="icon" style={{ color: "darkgreen", backgroundColor: "rgba(0, 128, 0, 0.2)" }} />,
      isMoney: false,
      link: "View inbound calls"
    },
    noAnswerCall: {
      title: "NO ANSWER CALL",
      icon: <CallMissedIcon className="icon" style={{ color: "red", backgroundColor: "rgba(255, 0, 0, 0.2)" }} />,
      isMoney: false,
      link: "View unanswered calls"
    },
    loginAgent: {
      title: "LOGIN AGENT",
      icon: <SupervisorAccountIcon className="icon" style={{ color: "navy", backgroundColor: "rgba(0, 0, 128, 0.2)" }} />,
      isMoney: false,
      link: "View login agents"
    },
    availableAgent: {
      title: "AVAILABLE AGENT",
      icon: <SupervisorAccountIcon className="icon" style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }} />,
      isMoney: false,
      link: "View available agents"
    },
    pauseAgent: {
      title: "PAUSE AGENT",
      icon: <PauseCircleOutlineIcon className="icon" style={{ color: "orange", backgroundColor: "rgba(255, 165, 0, 0.2)" }} />,
      isMoney: false,
      link: "View paused agents"
    },
    inCall: {
      title: "IN CALL",
      icon: <PhoneInTalkIcon className="icon" style={{ color: "dodgerblue", backgroundColor: "rgba(30, 144, 255, 0.2)" }} />,
      isMoney: false,
      link: "See details of in-call agents"
    },
  }[type] || {
   
    title: "UNKNOWN",
    icon: <PersonOutlinedIcon className="icon" style={{ color: "gray", backgroundColor: "rgba(128, 128, 128, 0.2)" }} />,
    isMoney: false,
    link: "No data available"
  };

  return (
    <div className="widget" onClick={onClick}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter"></span>
        <span className="link">{data.link} </span>
      </div>
      <div className="right">
        <div className="percentage positive">
        {`${amount}`}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
