import React, { useState } from "react";

import { Toast, Button, Row, Col } from "react-bootstrap";
import { X as XIcon } from "react-bootstrap-icons";
import Head from "./Head";

function notificationBox(initialNotifValue) {
  const [notifText, setNotifText] = useState(initialNotifValue);

  const setTextValue = (val, time = 15000) => {
    setNotifText(val);
    setTimeout(() => setNotifText(false), time);
  };

  function NotifBox() {
    return (
      <>
        {notifText && (
          <>
            <Head page={{ title: "You have a notification" }} />
            <div className="notification-container">
              <Toast className="d-flex justify-content-center align-items-center notification-box bg-light">
                <div className="notification-text mr-auto">
                  <Toast.Body className="text-info">{notifText}</Toast.Body>
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setNotifText(false)}
                >
                  <XIcon size="24" />
                </Button>
              </Toast>
            </div>
          </>
        )}
      </>
    );
  }

  return [NotifBox, setTextValue];
}

export default notificationBox;
