 import React, { useRef, useEffect } from 'react';
 import "./navbar.scss"

const PopupIframe = ({ visible, toggleVisibility, iframeSrc, title }) => {
  const popupRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (popupRef.current && headerRef.current) {
      dragElement(popupRef.current, headerRef.current);
    }
  }, []);
  const dragElement = (element, header) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  };

  return (
    <div
      ref={popupRef}
      className="popup-container"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div ref={headerRef} className="popup-header">
        <span>{title}</span>
        <button onClick={toggleVisibility} className="close-button">X</button>
      </div>
      <iframe src={iframeSrc} className="popup-iframe" title={title}></iframe>
    </div>
  );
};

export default PopupIframe;
