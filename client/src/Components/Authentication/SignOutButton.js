import React from "react";

import { Button } from 'react-bootstrap';

import makeRequest from "../Utils/makeRequest";
import { withRouter } from "react-router-dom";

function SignOutBtn({ signOut: signOutUser, as: Component, ...props }) {
    function signOut() {
        makeRequest([`/api/v1/signout`, "delete"], {}, ({ message: data }) => {
            if (data.message === "Success") {
                props.history.push(`/signin`);
                if (signOutUser) signOutUser();
            }
        }, (message) => {
            console.log("Error logging out: " + message);
        });
    }

    return (<>
        {Component ? <Component variant="info" onClick={signOut}>Sign Out</Component> : <Button variant="info" onClick={signOut}>Sign Out</Button>}
    </>);
}

export default withRouter(SignOutBtn);