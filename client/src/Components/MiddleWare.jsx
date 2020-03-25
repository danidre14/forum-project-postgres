import React, { useContext, useEffect } from "react";

import UserContext from "../context/userContext";

import makeRequest from "./Utils/makeRequest";

function MiddleWare({ history }) {
  const { signInUser, signOutUser, setNotifValue } = useContext(UserContext);

  const { request, cancel } = makeRequest();
  const checkIfLoggedIn = () => {
    function fetchUser() {
      request(
        [`/api/v1/users?isLoggedIn=true`, "get"],
        {},
        data => {
          if (data.message === "Success") {
            const user = { username: data.username, id: data.id };
            signInUser(user);
          } else signOutUser();
        },
        message => {
          console.log("Error: Got error trying to check if signed in");
        }
      );
    }

    fetchUser();
  };

  useEffect(() => {
    checkIfLoggedIn();
    return () => cancel();
  }, [history.location.pathname]);

  return <></>;
}

export default MiddleWare;
