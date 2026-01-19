// context/LeadModalContext.jsx
import { createContext, useContext, useState } from "react";

const LeadModalContext = createContext();

export const useLeadModal = () => useContext(LeadModalContext);

export const LeadModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLeadModal = () => setIsOpen(true);
  const closeLeadModal = () => setIsOpen(false);

  return (
    <LeadModalContext.Provider value={{ isOpen, openLeadModal, closeLeadModal }}>
      {children}
    </LeadModalContext.Provider>
  );
};
