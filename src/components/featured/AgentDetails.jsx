import React, { useState, useEffect } from "react";
import axios from "axios";
import "./featured.scss";
const imagePaths = [
  "/images/dashboard/weather-girl.png",
  "/images/dashboard/image3.png",
  "/images/avatars/default.0.png",
  "/images/avatars/default.1.png",
  "/images/avatars/default.2.png",
  "/images/avatars/default.3.png",
  "/images/avatars/default.4.png",
  "/images/avatars/default.5.png",
  "/images/avatars/default.6.png",
  "/images/avatars/default.7.png",
  "/images/avatars/default.8.png",
];

// Function to get a random image from the list
const getRandomImage = () => {
  return imagePaths[Math.floor(Math.random() * imagePaths.length)];
};

const WeatherCard = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [randomImage, setRandomImage] = useState(getRandomImage());
  const [userId, setUserId] = useState(""); // Store user_id
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
   
    axios
      .get(`https://${window.location.hostname}:4000/weater`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass JWT token
        },
      })
      .then((response) => {
        if (response.data.length > 0) {
          setUserId(response.data[0].user_id); // Store only user_id
        }
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
  
            if (response.data.address) {
              const { city, state, country } = response.data.address;
              const locationString = `${city || "Unknown City"}, ${state || "Unknown State"}, ${country || "Unknown Country"}`;
              setLocation(locationString);
            } else {
              setLocation("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Unable to fetch location");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);
  
  

  return (
    <div className="weather-container">
      <div className="weather-card">
        <div className="weather-content">
       
          <div className="left-section">
            <div className="icon-info">
              <img
                src="/images/dashboard/sun.png"
                alt="Weather Icon"
                className="weather-icon"
              />
              <div className="date-info">
                <h5>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h5>
                <h5>{new Date().toLocaleDateString()}</h5>
              </div>
            </div>

            <div className="admin-info">
              <h5>User ID: {userId || "Loading..."}</h5> {/* Display user_id */}
            </div>

            <div className="location">
              <img
                src="/images/dashboard/Location.png"
                alt="Location Icon"
                className="location-icon"
              />
              <h5>{location}</h5> {/* Dynamically update location */}
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            <div className="welcome-message">
              <h4>Welcome Back</h4>
              <h4>{time}</h4>
            </div>
            <img
              src={randomImage}
              alt="Random"
              className="random-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;