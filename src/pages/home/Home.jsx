import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom"; 
import "./home.scss";

// Lazy load components
const Widget = lazy(() => import("../../components/widget/Widget"));
const Featured = lazy(() => import("../../components/featured/Featured"));
const Chart = lazy(() => import("../../components/chart/Chart"));
const Table = lazy(() => import("../../components/table/Table"));

const Home = () => {
  const navigate = useNavigate();

  // Memoize this function to prevent re-creation on each render
  const handleWidgetClick = React.useCallback((type) => {
    navigate(`/data/${type}`);
  }, [navigate]);  

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          {/* Lazy load the widgets */}
          <Suspense fallback={<div>Loading widgets...</div>}>
            {[
              "totalCall",
              "answerCall",
              "cancelCall",
              "otherCall",
              "callQueue",
              "outboundCall",
              "inboundCall",
              "noAnswerCall",
              "loginAgent",
              "availableAgent",
              "pauseAgent",
              "inCall",
            ].map((type) => (
              <Widget
                key={type}
                type={type}
                onClick={() => handleWidgetClick(type)}
              />
            ))}
          </Suspense>
        </div>
        <div className="charts">
          <Suspense fallback={<div>Loading charts...</div>}>
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </Suspense>
        </div>
        <div className="listContainer">
          <Suspense fallback={<div>Loading table...</div>}>
            <Table />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Home;
