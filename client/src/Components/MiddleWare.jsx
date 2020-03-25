import React, { useContext, useEffect } from "react";

import UserContext from "../context/userContext";

import makeRequest from "./Utils/makeRequest";

function MiddleWare({ history }) {
  const { signInUser, signOutUser, setNotifValue } = useContext(UserContext);

  const checkIfLoggedIn = () => {
    function fetchUser() {
      makeRequest(
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
    // setNotifValue("Hello", "soft");
    checkIfLoggedIn();
  }, [history.location.pathname]);

  return <></>;
}

export default MiddleWare;
