import React, { useState, useRef, useEffect } from 'react';
import './navbar.scss';
import axios from 'axios';

const PopupIframe = ({ visible, toggleVisibility, iframeSrc, title }) => {
  const popupRef = useRef(null);
  const headerRef = useRef(null);

  // State for counters and live call data
  const [counters, setCounters] = useState([
    { label: 'Login', value: 0, className: 'login' },
    { label: 'Available', value: 0, className: 'available' },
    { label: 'Pause', value: 0, className: 'pause' },
    { label: 'In Call', value: 0, className: 'in-call' },
    { label: 'Call Dialing', value: 0, className: 'call-dialing' },
    { label: 'Call Queue', value: 0, className: 'call-queue' },
  ]);
  const [liveCalls, setLiveCalls] = useState([]);

  useEffect(() => {
    if (popupRef.current && headerRef.current) {
      dragElement(popupRef.current, headerRef.current);
    }

    // Fetch data periodically
    const intervalId = setInterval(() => {
      fetchCounters();
      fetchLiveCalls();
    }, 2000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await axios.post('dash_live_agents.php', { filter_data: 'today' });
      const { login_agents, idle_agents, pause_agents, in_call_agents, call_queue_agents, call_dial_agents } = response.data;
      setCounters([
        { label: 'Login', value: login_agents || 0, className: 'login' },
        { label: 'Available', value: idle_agents || 0, className: 'available' },
        { label: 'Pause', value: pause_agents || 0, className: 'pause' },
        { label: 'In Call', value: in_call_agents || 0, className: 'in-call' },
        { label: 'Call Dialing', value: call_dial_agents || 0, className: 'call-dialing' },
        { label: 'Call Queue', value: call_queue_agents || 0, className: 'call-queue' },
      ]);
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  const fetchLiveCalls = async () => {
    try {
      const response = await axios.post('liveajaxfie.php');
      setLiveCalls(response.data || []);
    } catch (error) {
      console.error('Error fetching live calls:', error);
    }
  };

  // Function to make the popup draggable
  const dragElement = (element, header) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + 'px';
      element.style.left = (element.offsetLeft - pos1) + 'px';
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  };

  const handleCallAction = (agentNumber, actionType) => {
    const actionCode = actionType === 'spy' ? '99' : actionType === 'barge' ? '98' : '97';
    document.getElementById('popupIframe').src = `/Telephony/AdminPhone/Phone/click-wisper.php?d=${actionCode}${agentNumber}`;
  };

  return (
    <div
      ref={popupRef}
      className="popup-container"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div ref={headerRef} className="popup-header">
        <span>{title}</span>
        <button onClick={toggleVisibility} className="close-button">X</button>
      </div>

      {/* Counters */}
      <div className="popup-counters">
        {counters.map((counter, index) => (
          <span key={index} className={`counter ${counter.className}`}>
            {counter.label}: {counter.value}
          </span>
        ))}
      </div>

      {/* Live Calls Table */}
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
              liveCalls.map((call, index) => (
                <tr key={index} style={{ color: call.status === 'Answer' ? 'green' : 'red' }}>
                  <td>{index + 1}</td>
                  <td>{call.time}</td>
                  <td>{call.Full_name}</td>
                  <td>{call.Agent}</td>
                  <td>{call.call_from}</td>
                  <td>{call.call_to}</td>
                  <td>{call.status}</td>
                  <td>{call.time_in_seconds || '00:00:00'}</td>
                  <td style={{ color: call.direction === 'outbound' ? 'purple' : 'blue' }}>
                    {call.direction}
                  </td>
                  <td>
                    <button onClick={() => handleCallAction(call.Agent, 'spy')}>Spy</button>
                    <button onClick={() => handleCallAction(call.Agent, 'barge')}>Barge</button>
                    <button onClick={() => handleCallAction(call.Agent, 'whisper')}>Whisper</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="error-row">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Iframe */}
      <iframe id="popupIframe" src={iframeSrc} className="popup-iframe" title={title}></iframe>
    </div>
  );
};

export default PopupIframe;
