import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const useAutoDial = (
  user,
  token,
  popupState,
  updateIframeSrc,
  toggleIframe
) => {
  const [autoDialOn, setAutoDialOn] = useState(false); // agent toggle
  const [autoDialStatus, setAutoDialStatus] = useState(false); // admin flag
  const [cooldown, setCooldown] = useState(false); // prevents overlapping calls
  const [isDialing, setIsDialing] = useState(false); // prevents multiple concurrent requests

  // ✅ SweetAlert Toast config
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const formatNumber = (number) => {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10)
      return digits.startsWith("0") ? digits : `0${digits}`;
    if (digits.length > 10) return `0${digits.slice(-10)}`;
    return digits;
  };

  // Fetch admin auto-dial status
  useEffect(() => {
    if (!user?.user_id) return;
    axios
      .get(
        `https://${window.location.hostname}:4000/auto_dial/${user.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setAutoDialStatus(res.data?.auto_dial_status === "1"))
      .catch((err) => {
        console.error("Failed to fetch auto dial status", err);
        Toast.fire({ icon: "error", title: "Failed to fetch AutoDial status" });
      });
  }, [user?.user_id, token]);

  const dialBtn = useCallback(async () => {
    if (!autoDialOn || cooldown || isDialing) return;

    setIsDialing(true);
    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/ap/autodial`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = response.data;
      console.log("🔔 DialBtn fired, backend response:", res);

      // ✅ Strict blocking conditions
      if (res === "live") {
        return;
      }

      if (res === "wrapup") {
        await Swal.fire({
          title: "⏳ You are in Wrap-up Mode",
          text: "Do you want to reset wrapup to continue auto-dialing?",
          icon: "warning",
          confirmButtonText: "✅ Reset Wrapup",
          showCancelButton: true,
          cancelButtonText: "❌ Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.post(
                `https://${window.location.hostname}:4000/agent-wrapup`,
                { wrapup: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Toast.fire({
                icon: "success",
                title: "Wrapup reset successfully ✅",
              });
            } catch (err) {
              console.error("Reset wrapup failed:", err);
              Toast.fire({ icon: "error", title: "Failed to reset wrapup" });
            }
          }
        });

        return; // 🚫 Stop here
      }
 
      if (res && res.number) {
        const number = formatNumber(res.number);
        const name = encodeURIComponent(res.name || "");
        const email = encodeURIComponent(res.email || "");

        const newSrc = `https://${
          window.location.hostname
        }/softphone/Phone/click-to-dial.html?profileName=${
          user.full_name
        }&SipDomain=${window.location.hostname}&SipUsername=${
          user.user_id
        }&SipPassword=${user.password}&d=${encodeURIComponent(
          number
        )}&name=${name}&email=${email}`;

        if (!popupState.iframeSrc.includes(`d=${number}`)) {
          console.log("📞 Dialing new number:", number);
          updateIframeSrc(newSrc);
          Toast.fire({ icon: "success", title: `Dialing ${number}` });

          if (!popupState.phone) toggleIframe("phone");
        } else {
          console.log("⚠️ Skipping duplicate number:", number);
          Toast.fire({ icon: "info", title: "Skipping duplicate number" });
        }

        // ⏳ Cooldown 30s
        setCooldown(true);
        setTimeout(() => setCooldown(false), 30000);
      } else {
        Toast.fire({ icon: "info", title: "No leads available to dial" });
      }
    } catch (error) {
      console.error("❌ AutoDial error:", error);
      Toast.fire({ icon: "error", title: "AutoDial request failed" });
    } finally {
      setIsDialing(false);
    }
  }, [
    autoDialOn,
    cooldown,
    isDialing,
    user,
    token,
    popupState,
    updateIframeSrc,
    toggleIframe,
  ]);

  // Main interval for auto-dial
  useEffect(() => {
    if (!autoDialOn) return;
    const interval = setInterval(dialBtn, 10000);
    return () => clearInterval(interval);
  }, [autoDialOn, dialBtn]);

  // Toggle auto-dial on/off
  const handleAutoDialToggle = async () => {
    const newState = !autoDialOn;
    setAutoDialOn(newState);

    try {
      await axios.post(
        `https://${window.location.hostname}:4000/auto_dial/toggle`,
        { user_id: user.user_id, status: newState ? 1 : 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (newState) {
        Toast.fire({ icon: "success", title: "🚀 Auto Dialing Started" });
      } else {
        Toast.fire({ icon: "warning", title: "⏹ Auto Dialing Stopped" });
      }
    } catch (error) {
      console.error("Failed to update auto dial status", error);
      Toast.fire({ icon: "error", title: "Failed to toggle AutoDial" });
    }
  };

  return { autoDialOn, autoDialStatus, handleAutoDialToggle };
};
