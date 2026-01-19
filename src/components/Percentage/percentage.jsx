import   { useEffect, useState } from "react";
import axios from "axios";
import "./percentage.scss";
 const Percentage = () => {
  const [sources, setSources] = useState([]);
  const [range, setRange] = useState("day"); // 👈 control day/week/month
    const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchPerformance = async () => {
   
      try {
        const res = await axios.get(
          `https://${window.location.hostname}:4000/top-caller?range=${range}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSources(res.data);
      } catch (err) {
        console.error("Top Caller API error:", err);
      }
    };
    fetchPerformance();
  }, [ range]);

  return (
    <div className="traffic-sources-card">
      <div className="header">
        <h3 className="title">Top Callers ({range})</h3>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {sources.length > 0 ? (
        sources.map((source) => (
          <div key={source.user_id} className="source-item">
            <div className="label">
              <span>{source.name}</span>
              <span>
                {source.calls} calls ({source.percentage}%)
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="filled"
                style={{
                  width: `${source.percentage}%`,
                  backgroundColor: source.color,
                }}
              ></div>
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Percentage;
