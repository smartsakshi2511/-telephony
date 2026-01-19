// src/hooks/useBreakStatus.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useBreakStatus = (user, popupState, updateIframeSrc, toggleIframe) => {
  const [selectedBreak, setSelectedBreak] = useState("Ready");

  const handlePhoneDND = (status) => {
    if (!user) return;
    const message = status === "Ready" ? "false" : "true";
    const newSrc = `https://${window.location.hostname}/softphone/Phone/index.html?profileName=${user.full_name}&SipDomain=${window.location.hostname}&SipUsername=${user.user_id}&SipPassword=${user.password}&DND=${message}`;

    if (popupState.iframeSrc !== newSrc) {
      updateIframeSrc(newSrc); // ✅ consistent name
    }
    if (!popupState.phone) {
      toggleIframe("phone");
    }
  };

  const fetchBreakStatus = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const response = await axios.get(
        `https://${window.location.hostname}:4000/log/get_agent_status`,
        { params: { user_id: user.user_id } }
      );
      if (response.data.break_type) {
        setSelectedBreak(response.data.break_type);
        handlePhoneDND(response.data.break_type); // 🔥 sync phone when fetching
      }
    } catch (error) {
      console.error("Error fetching break status:", error);
    }
  }, [user?.user_id]);

  useEffect(() => {
    fetchBreakStatus();
  }, [fetchBreakStatus]);

  const updateBreakStatus = async (breakType) => {
    try {
      await axios.post(
        `https://${window.location.hostname}:4000/log/break_time`,
        { user_id: user.user_id, break_type: breakType }
      );
      setSelectedBreak(breakType);
      handlePhoneDND(breakType); // 🔥 update phone immediately
    } catch (error) {
      console.error("Error updating break:", error);
    }
  };

  return { selectedBreak, updateBreakStatus };
};
