import React from "react";
import { useHistory } from "react-router-dom";

function DivLink(props) {
  const href = props.to || "/";

  const history = useHistory();

  function handleClick() {
    history.push(href);
  }

  return <div onClick={handleClick}>{props.children}</div>;
}

export default DivLink;
