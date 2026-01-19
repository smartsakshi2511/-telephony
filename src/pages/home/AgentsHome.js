import React , { useContext }  from "react";
import { useNavigate } from "react-router-dom"; 
import "./home.scss";
import { PopupContext } from "../../context/iframeContext"; 
import PopupIframe from "../../components/navbar/LiveCall";  
import Widget from "../../components/widget/Widget";
import WeatherCard from "../../components/featured/AgentDetails";
import AnnouncementCard from "../../components/featured/Agent_Allowancement_Card";
import AgentTable from "../../components/table/AgentTable";

const AgentHome = () => {
  const navigate = useNavigate();
  const { popupState, toggleIframe } = useContext(PopupContext); 

  const iframeTypes = [ "callQueue","availableAgent","inCall"];

  const handleWidgetClick = (type) => {
    if (iframeTypes.includes(type)) {
      toggleIframe("call");
    } else {
      navigate(`agent/data/${type}`);
    }
  };
  
   return (
    <div className="home">
      <div className="homeContainer">
      <div className="topSection">
      <div className="widgets">
        {[
          "totalCall",
          "answerCall",
          "cancelCall",
          "otherCall",
          "availableAgent",
          "callQueue",
          
        ].map((type) => (
          <Widget key={type} type={type} onClick={() => handleWidgetClick(type)} />
        ))}
      </div>
     <div className="details">
     <WeatherCard  aspect={2 / 1}/>
       <AnnouncementCard aspect={2 / 1}/>
     </div>
    
    </div>

        <div className="listContainer">
          <AgentTable />
        </div>
      </div>
      {popupState.call && <PopupIframe id="call"   toggleVisibility={() => toggleIframe("call")} title="Live Calls" />}
    </div>
  );
};

export default AgentHome;
