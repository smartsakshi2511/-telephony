import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Home = () => {
  const navigate = useNavigate();

  const handleWidgetClick = (type) => {
    navigate(`/data/${type}`);
  };

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          {[
            "totalCall", "answerCall", "cancelCall", "otherCall", 
            "callQueue", "outboundCall", "inboundCall", "noAnswerCall",
            "loginAgent", "availableAgent", "pauseAgent", "inCall"
          ].map((type) => (
            <Widget key={type} type={type} onClick={() => handleWidgetClick(type)} />
          ))}
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
