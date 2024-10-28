 
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert"; 
import "react-circular-progressbar/dist/styles.css"; 
import * as React from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Featured = () => {
 
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

 
  const defaultData = [
    { name: "Answer Call", value: 30 },
    { name: "Cancel Call", value: 20 },
    { name: "Other Call", value: 50 },
  ];

 
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API endpoint (replace with your real API)
        const response = await axios.get('/api/piechart-data');
        
        // Assuming the API returns an array of objects with id, value, and label
        const data = response.data.map((item) => ({
          name: item.label,
          value: item.value,
        }));

        setChartData(data);  // Set the fetched data
        setLoading(false);    // Set loading to false
      } catch (err) {
        // If an error occurs, set the default fallback data
        setError("Failed to fetch chart data, using default values.");
        setChartData(defaultData);  // Use the default data if API call fails
        setLoading(false);    // Set loading to false
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Status</h1>
        <MoreVertIcon fontSize="small" />
      </div>

      <div className="bottom">
     
          {/* Loading, Error, and PieChart */}
          {loading ? (
            <p>Loading chart...</p>
          ) : error ? (
            <>
            
              {/* Show fallback data if there's an error */}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={defaultData}  // Use defaultData if API call fails
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {defaultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}  // Use fetched data from API if available
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
    

        

        <div className="summary">
          <div className="item">
            <div className="itemTitle">Answer Call</div>
            
     
          </div>
          <div className="item">
            <div className="itemTitle">Cancel Call</div>
            
          </div>
          <div className="item">
            <div className="itemTitle">Other Call </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
