import React, { useState, useEffect } from "react";

import makeRequest from "./Utils/makeRequest";
import { Route, Redirect } from "react-router-dom";
import LoadingAnim from "./LoadingAnim";

function ControlRoute({ component: Component, ...props }) {
  const pathname = props.location.pathname;
  const query = props.location.search;
  const fullPath = `${pathname}${query}`;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function getData() {
      makeRequest(
        [`/api/v1${fullPath}`],
        {},
        ({ message }) => {
          if (message) {
            const { code, value } = message;
            if (code && code === "REROUTE" && value && value !== pathname)
              // props.history.push(value);
              setLoaded(value);
            else setLoaded(true);
          } else setLoaded(true);
        },
        () => {}
      );
    }
    getData();
  }, []);

  return (
    <>
      <Route
        {...props}
        render={routeProps =>
          loaded === true ? (
            <Component {...props} {...routeProps} />
          ) : loaded === false ? (
            <>
              {" "}
              <LoadingAnim />
            </>
          ) : (
            <Redirect to={loaded} />
          )
        }
      />
    </>
  );
}

export default ControlRoute;
