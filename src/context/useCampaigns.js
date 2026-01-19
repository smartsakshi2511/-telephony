import { useState, useEffect } from "react";
import axios from "axios";

export const useCampaigns = () => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://${window.location.hostname}:4000/campaigns_dropdown`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const options = data.map((c) => ({
          id: c.compaign_id,
          label: c.compaignname,
        }));
        setCampaignOptions([{ id: "", label: "--- Select Campaign ---" }, ...options]);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return { campaignOptions, loading };
};
