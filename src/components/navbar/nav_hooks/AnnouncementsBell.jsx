// hooks/useAnnouncements.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useAnnouncements = (token) => {
  const [announcements, setAnnouncements] = useState([]);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    if (!token) return;

    const checkForNewAnnouncements = async () => {
      try {
        const res = await axios.get(
          `https://${window.location.hostname}:4000/announcements/today`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetched = res.data;
        if (
          fetched.length &&
          (!announcements.length || announcements[0]?.id !== fetched[0]?.id)
        ) {
          setUnread(true);
        }
        setAnnouncements(fetched);
      } catch (error) {
        console.error("Error checking announcements:", error);
      }
    };

    checkForNewAnnouncements();
    const interval = setInterval(checkForNewAnnouncements, 30000);

    return () => clearInterval(interval);
  }, [token]);

  return { announcements, unread, setUnread };
};
