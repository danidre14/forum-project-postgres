import React, { useEffect, useContext } from "react";

import UserContext from "../../context/userContext";
import { parseQueryString } from "../../util/utilities";

import makeRequest from "../Utils/makeRequest";


import LoadingAnim from "../LoadingAnim";

function SignOut(props) {
    const { user, signOutUser } = useContext(UserContext);

    const query = props.location.search;
    const { id: qId, username: qUsername } = parseQueryString(query);
    const { id, username } = user;


    function signOut() {
        makeRequest([`/api/v1/signout${query}`, "delete"], {}, ({ message: data }) => {
            if (data.message === "Success") {
                props.history.goBack();
                if (signOutUser) signOutUser();
            } else {
                props.history.goBack();
            }
        }, (message) => {
            console.log("Error logging out: " + message);
            props.history.goBack();
        });
    }

    useEffect(() => {
        if (qId && qUsername && id == qId && username == qUsername) signOut();
        else {
            props.history.goBack();
        }
    }, [])

    return (<>
        <LoadingAnim />
    </>);
}

export default SignOut;