import React, { useState } from "react";

import { Alert, Toast } from "react-bootstrap";

function notificationBox(initialNotifValue) {
  const [notifText, setNotifText] = useState(initialNotifValue);

  const setTextValue = (val, time) => {
    setNotifText(val);
    setTimeout(() => setNotifText(false), time || 20000);
  };

  function NotifBox() {
    const [hovering, setHovering] = useState(false);

    var hoverStyle;
    if (hovering) {
      hoverStyle = { cursor: "pointer" };
    }

    function toggleHover() {
      setHovering(!hovering);
    }

    return (
      <>
        {notifText && (
          <div
            style={hoverStyle}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            className="d-flex justify-content-center align-items-center notification-container"
          >
            <Toast
              className="notification-box"
              onClick={() => setNotifText(false)}
            >
              {/* <Toast.Header>
                <strong className="mr-auto">Notification</strong>
              </Toast.Header> */}
              <Toast.Body className="text-info">{notifText}</Toast.Body>
            </Toast>
          </div>
        )}
      </>
    );
  }

  return [NotifBox, setTextValue];
}

export default notificationBox;
