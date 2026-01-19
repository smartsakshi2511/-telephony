import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";
import "./home.scss";
import PopupIframe from "../../components/navbar/LiveCall";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import Percentage from "../../components/Percentage/percentage"

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { popupState, toggleIframe } = useContext(PopupContext);

  const iframeTypes = ["callQueue", "loginAgent", "availableAgent", "pauseAgent", "inCall"];

  const handleWidgetClick = (type) => {
    if (iframeTypes.includes(type)) {
      toggleIframe("call");
    } else {
      let basePath = "";

      switch (user?.user_type) {
        case "8":
          basePath = "admin";
          break;
        case "2":
          basePath = "team_leader";
          break;
        case "9":
          basePath = "superadmin";
          break;
        case "7":
          basePath = "manager";
          break;
        default:
          basePath = "agent";
      }

      navigate(`/${basePath}/data/${type}`);
    }
  };


  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          {[
            "totalCall",
            "answerCall",
            "cancelCall",
            "otherCall",
            "outboundCall",
            "inboundCall",
            "noAnswerCall",
            "callQueue",
            "loginAgent",
            "availableAgent",
            "pauseAgent",
            "inCall",
          ].map((type) => (
            <Widget key={type} type={type} onClick={() => handleWidgetClick(type)} />
          ))}
        </div>

        <div className="charts">
          <div className="chartRow">
            <Percentage />
            <Featured title="Last 6 Months (Calls)" />
            <Chart title="Campaign Performance" aspect={2 / 1} />
          </div>
        </div>


        <div className="listContainer">
          <Table />
        </div>
      </div>

      {popupState.call && <PopupIframe id="call" toggleVisibility={() => toggleIframe("call")} title="Live Calls" />}
    </div>
  );
};

export default Home;
