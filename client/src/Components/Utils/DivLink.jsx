import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function DivLink(props) {
  const href = props.to || "/";
  const [hovering, setHovering] = useState(false);

  var linkStyle;
  if (hovering) {
    linkStyle = { cursor: "pointer" };
  }

  const history = useHistory();

  function handleClick(e) {
    if (
      e.target.tagName.toLowerCase() === "a" ||
      e.target.tagName.toLowerCase() === "button"
    )
      return;
    history.push(href);
  }

  function startHover() {
    setHovering(true);
  }
  function stopHover() {
    setHovering(false);
  }

  return (
    <div
      style={linkStyle}
      onMouseEnter={startHover}
      onMouseLeave={stopHover}
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
}

export default DivLink;
