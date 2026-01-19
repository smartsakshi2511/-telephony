import { useState, useRef, useEffect, useContext } from "react";
import "./navbar.scss";
import axios from "axios";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAssistiveListeningSystems,
  faPhoneSquare,
  faUser,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";

const PopupIframe = ({ visible, toggleVisibility, title }) => {
  const { user } = useContext(AuthContext);
  const { updateIframeSrc, toggleIframe, popupState } =
    useContext(PopupContext);
  const popupRef = useRef(null);
  const headerRef = useRef(null);
  const [answerTimestamps, setAnswerTimestamps] = useState({});
  const [counters, setCounters] = useState([
    { label: "Login", value: 0, className: "login" },
    { label: "Available", value: 0, className: "available" },
    { label: "Pause", value: 0, className: "pause" },
    { label: "In Call", value: 0, className: "in-call" },
    { label: "Call Dialing", value: 0, className: "call-dialing" },
    { label: "Call Queue", value: 0, className: "call-queue" },
  ]);
  const [liveCalls, setLiveCalls] = useState([]);

  const updateCounters = (data) => {
    const keyMapping = {
      Login: "login",
      Available: "available",
      Pause: "pause",
      "In Call": "in_call",
      "Call Dialing": "call_dialing",
      "Call Queue": "call_queue",
    };
    setCounters((prev) =>
      prev.map((counter) => ({
        ...counter,
        value: data[keyMapping[counter.label]] || 0,
      }))
    );
  };

  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          `https://${window.location.hostname}:4000/agent-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data) updateCounters(res.data);
      } catch (error) {
        console.error("Agent status error:", error);
      }
    };
    fetchAgentStatus();
    const id = setInterval(fetchAgentStatus, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => fetchLiveCalls(), 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchLiveCalls = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://${window.location.hostname}:4000/live-calls`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(res.data)) {
        setLiveCalls((prevCalls) =>
          res.data.map((call) => {
            const existing = prevCalls.find(
              (c) => c.uniqueid === call.uniqueid
            );
            const prevStatus = existing?.status?.toLowerCase();
            const currStatus = call.status?.toLowerCase();
            if (currStatus === "answer" && prevStatus !== "answer") {
              setAnswerTimestamps((prev) => ({
                ...prev,
                [call.uniqueid]: new Date(),
              }));
            }
            return call;
          })
        );
      } else setLiveCalls([]);
    } catch (err) {
      if (err.response?.status === 401) localStorage.removeItem("token");
      else if (err.response?.status === 404) setLiveCalls([]);
      else console.error("Live call error:", err);
    }
  };

  const handleCallAction = async (agentNumber, actionType, channel = null) => {
    if (actionType === "hangup") {
      if (!channel) return alert("Missing channel.");
      try {
        const res = await axios.get(
          `http://${
            window.location.hostname
          }/telephony_api/admin_call_hangup.php?channel=${encodeURIComponent(
            channel
          )}`
        );
        alert(res.data.status === "success" ? "Hung up." : res.data.message);
      } catch {
        alert("Hangup failed.");
      }
      return;
    }

    const prefix =
      actionType === "listen" ? "97" : actionType === "barge" ? "98" : "99";
    const dialNumber = `${prefix}${agentNumber}`;
    const { user_id, password, full_name } = user;
    const domain = window.location.hostname;
    const url = `https://${domain}/softphone/Phone/click-wisper.html?profileName=${full_name}&SipDomain=${domain}&SipUsername=${user_id}&SipPassword=${password}&d=${dialNumber}`;
    updateIframeSrc(url);
    toggleIframe("phone");
  };

  const calculateDuration = (call) => {
    const status = call.status?.toLowerCase();
    const id = call.uniqueid;
    if (status !== "answer" || !answerTimestamps[id]) return "00:00:00";
    const secs = Math.floor(
      (new Date() - new Date(answerTimestamps[id])) / 1000
    );
    return [Math.floor(secs / 3600), Math.floor((secs % 3600) / 60), secs % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  };

  return (
    <>
      <div
        ref={popupRef}
        className="popup-container"
        style={{ display: visible ? "block" : "none" }}
      >
        <div ref={headerRef} className="popup-header">
          <span>{title}</span>
          <button onClick={toggleVisibility} className="close-button">
            X
          </button>
        </div>

        <div className="popup-counters">
          {counters.map((c, i) => (
            <span key={i} className={`counter ${c.className}`}>
              {c.label}: {c.value}
            </span>
          ))}
        </div>

        <div className="popup-content">
          <table className="live-calls-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Start Time</th>
                <th>Agent Name</th>
                <th>Agent ID</th>
                <th>Call From</th>
                <th>Call To</th>
                <th>Call Status</th>
                <th>Duration</th>
                <th>Direction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveCalls.length > 0 ? (
                liveCalls.map((call, index) => {
                  const statusColor =
                    call.status?.toLowerCase() === "answer"
                      ? "green"
                      : call.Agent?.toUpperCase() === "NOAGENT" ||
                        call.status?.toLowerCase() === "ringing"
                      ? "teal"
                      : "red";
                  const directionColor =
                    call.direction === "outbound" ? "purple" : "blue";

                  return (
                    <tr key={call.uniqueid} style={{ color: statusColor }}>
                      <td>{index + 1}</td>
                      <td>{moment(call.time).format("YYYY-MM-DD HH:mm:ss")}</td>
                      <td>{call.Agent_name}</td>
                      <td>{call.Agent}</td>
                      <td>{call.call_from}</td>
                      <td>{call.call_to}</td>
                      <td>
                        <span style={{ marginRight: "6px" }}>
                          {call.status?.toLowerCase() === "answer" && "🟢"}
                          {call.status?.toLowerCase() === "ringing" && "🟠"}
                          {(call.Agent?.toUpperCase() === "NOAGENT" ||
                            !call.status) &&
                            "🔴"}
                        </span>
                        {call.status || "N/A"}
                      </td>
                      <td>{calculateDuration(call)}</td>
                      <td
                        style={{
                          color: directionColor,
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {call.direction}
                      </td>
                      <td className="call-action-buttons">
                        <Tooltip title="Listen">
                          <IconButton
                            onClick={() =>
                              handleCallAction(call.Agent, "listen")
                            }
                            style={buttonStyle("blue")}
                          >
                            <FontAwesomeIcon
                              icon={faAssistiveListeningSystems}
                              style={iconStyle("blue")}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Barge">
                          <IconButton
                            onClick={() =>
                              handleCallAction(call.Agent, "barge")
                            }
                            style={buttonStyle("purple")}
                          >
                            <FontAwesomeIcon
                              icon={faPhoneSquare}
                              style={iconStyle("purple")}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Whisper">
                          <IconButton
                            onClick={() =>
                              handleCallAction(call.Agent, "whisper")
                            }
                            style={buttonStyle("orange")}
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              style={iconStyle("orange")}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Hangup">
                          <IconButton
                            onClick={() =>
                              handleCallAction(
                                call.Agent,
                                "hangup",
                                call.channel
                              )
                            }
                            style={buttonStyle("red")}
                          >
                            <FontAwesomeIcon
                              icon={faPhoneSlash}
                              style={iconStyle("red")}
                            />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {popupState.phone}
    </>
  );
};

const buttonStyle = (color) => ({
  padding: "4px",
  margin: "4px",
  border: `2px solid ${color}`,
  borderRadius: "4px",
  backgroundColor: "white",
});

const iconStyle = (color) => ({
  color,
  fontSize: "10px",
});

export default PopupIframe;
