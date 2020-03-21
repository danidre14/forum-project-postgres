import React from "react";

import { Button } from 'react-bootstrap';

import makeRequest from "../Utils/makeRequest";
import { withRouter } from "react-router-dom";

function SignOut(props) {
    function signOut() {
        makeRequest([`/api/v1/signout`, "delete"], {}, ({ message: data }) => {
            if (data.message === "Success") {
                props.history.push(`/signin`);
                if (props.signOut) props.signOut();
            }
        }, (message) => {
            alert("Error logging out: " + message);
        });
    }

    return (
        <Button variant="info" onClick={signOut}>Sign Out</Button>
    );
}

export default withRouter(SignOut);