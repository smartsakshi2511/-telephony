import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [leadFormData, setLeadFormData] = useState(null);

  const [popupState, setPopupState] = useState({
    call: false,
    phone: false,
    iframeSrc: "",
  });

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data || {};

      if (type === "OPEN_REACT_FORM") {
        setLeadFormData(payload);
      }

      if (type === "CLOSE_PHONE_POPUP") {
        toggleIframe("phone");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
 
  useEffect(() => {
    if (user) {
      const baseUrl = `https://${window.location.hostname}/softphone/Phone/index.html`;
      const query = `profileName=${user.full_name}&SipDomain=${window.location.hostname}&SipUsername=${user.user_id}&SipPassword=${user.password}`;

      setPopupState((prev) => ({
        ...prev,
        iframeSrc: `${baseUrl}?${query}`,
      }));
    }
  }, [user]);

  const toggleIframe = (type) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }; 
  const updateIframeSrc = (newSrc) => {
    setPopupState((prev) => ({
      ...prev,
      iframeSrc: "",  
    })); 
    setTimeout(() => {
      setPopupState((prev) => ({
        ...prev,
        iframeSrc: newSrc,
        phone: true,  
      }));
    }, 50);
  };

  const updateDNDmode = (newSrc) => {
    setPopupState((prev) => {
      if (prev.iframeSrc !== newSrc) {
        return { ...prev, iframeSrc: newSrc };
      }
      return prev;
    });
  };

  const handleCallAction = (agentNumber, mode) => {
    if (!user) return;

    const dialPrefixes = {
      listen: "97",
      barge: "98",
      whisper: "99",
    };

    const dialPrefix = dialPrefixes[mode];
    const dialNumber = `${dialPrefix}${agentNumber}`;

    const baseUrl = `https://${window.location.hostname}/softphone/Phone/click-wisper.html`;
    const query = `profileName=${user.full_name}&SipDomain=${window.location.hostname}&SipUsername=${user.user_id}&SipPassword=${user.password}&d=${dialNumber}`;
    const newSrc = `${baseUrl}?${query}`;

    updateIframeSrc(newSrc);  
  };

  return (
    <PopupContext.Provider
      value={{
        popupState,
        iframeSrc: popupState.iframeSrc,
        toggleIframe,
        updateIframeSrc,
        updateDNDmode,
        leadFormData,
        handleCallAction,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
