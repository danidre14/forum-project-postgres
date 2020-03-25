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
    const { request, cancel } = makeRequest();
    function getData() {
      request(
        [`/api/v1${fullPath}`],
        {},
        () => {
          // if (message) {
          //   const { code, value } = message;
          //   if (code && code === "REROUTE" && value && value !== pathname)
          //     // props.history.push(value);
          //     setLoaded(value);
          //   else setLoaded(true);
          // } else
          setLoaded(true);
        },
        () => {}
      );
    }
    getData();
    return () => cancel();
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
