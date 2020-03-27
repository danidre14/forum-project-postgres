import React, { useContext } from "react";

import UserContext from "../../context/userContext";

import { Link } from "react-router-dom";

import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

import { Validator } from "../../util/utilities";

import useErrors from "../Utils/useErrors";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange";

function SignUp(props) {
    const { setNotifValue } = useContext(UserContext);
    const [Error, setError] = useErrors(false);

    const [{ username, email, email2, password, password2 }, handleInputChange] = useInputChange({
        username: "",
        email: "",
        email2: "",
        password: "",
        password2: ""
    });

    const doSignUp = (e) => {
        if (username === "" || email === "" || email2 === "" || password === "" || password2 === "") return;
        e.preventDefault();

        const user = { username, email, email2, password, password2 }
        const canProceed = validateInfomation(user);
        if (canProceed !== true) {
            const msg = [];
            for (const i in canProceed)
                if (canProceed[i] !== "") msg.push(canProceed[i]);
            return setError(msg.join("\n"));
        }

        function postData() {
            setError(false);
            const { request, cancel } = makeRequest();
            request([`/api/v1/signup/`, "post"], user, ({ message: data }) => {
                if (data.message === "Success") {
                    props.history.push(data.gotoUrl || `/signin/`);
                    if (data.notif)
                        setNotifValue(data.notif);
                } else if (data.notif)
                    setNotifValue(data.notif, 5000);
                else {
                    if (typeof data === "string") {
                        setError(data);
                    } else {
                        const msg = [];
                        for (const i in data)
                            if (data[i] !== "") msg.push(data[i]);
                        setError(msg.join("\n"));
                    }
                }
            }, (message) => {
                setError("Cannot sign up: " + message);
            });
        }
        postData();
    }

    return (
        <>
            <Card className="mb-3 no-border shadow-sm">
                <Card.Body>
                    <Card.Title as="h2" className="mb-3">Sign Up</Card.Title>
                    <Form className="mb-3">
                        <Form.Group as={Row} controlId="username">
                            <Form.Label column sm="auto">Username</Form.Label>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Prepend >
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        placeholder="Username"
                                        name="username"
                                        value={username}
                                        required={true}
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="auto">Email</Form.Label>
                            <Col>
                                <Form.Group as={Row} controlId="email">
                                    <Col>
                                        <Form.Control
                                            size="sm"
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={email}
                                            required={true}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="email2">
                                    <Col>
                                        <Form.Control
                                            size="sm"
                                            type="email"
                                            placeholder="Confirm Email"
                                            name="email2"
                                            value={email2}
                                            required={true}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="auto">Password</Form.Label>
                            <Col>
                                <Form.Group as={Row} controlId="password">
                                    <Col>
                                        <Form.Control
                                            size="sm"
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={password}
                                            required={true}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="password2">
                                    <Col>
                                        <Form.Control
                                            size="sm"
                                            type="password"
                                            placeholder="Confirm Password"
                                            name="password2"
                                            value={password2}
                                            required={true}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Group>
                        <Button variant="info" type="submit" onClick={doSignUp}>Sign Up</Button>
                    </Form>
                    <Error />
                    <hr />
                    <Card.Text>Already have an account?<Link to="/signin"> Sign In</Link></Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}

function validateInfomation(info) {
    let error = false;

    //username validation
    const username = info.username;
    let uMessage = "";
    if (username.length < 4 || username.length > 15) {
        uMessage += "-Username must be 4-15 characters long";
        error = true;
    } else {
        if (username.charAt(0).match(/^[a-z]+$/ig) === null) {
            uMessage += "-Username must start with a letter\n";
            error = true;
        } else if (username.match(/^[a-z][a-z\d]+$/ig) === null) {
            uMessage += "-Symbols/Spaces not allowed in username";
            error = true;
        }
    }

    //password validation
    const pName = info.password;
    let pMessage = "";
    if (pName.length < 8) {
        pMessage += "-Password must be 8 or more characters\n";
        error = true;
    }
    // if(pName.match(/^[a-z\d]+$/ig) === null) {
    //     pMessage += "-Password cannot contain symbols or spaces\n";
    //     error = true;
    // }
    if (pName.search(/\d/) === -1) {
        pMessage += "-Password must contain at least one number\n";
        error = true;
    }
    if (pName.search(/[A-Z]/) === -1) {
        pMessage += "-Password must contain at least one uppercase letter";
        error = true;
    }
    //re-entered password
    const p2Name = info.password2;
    let p2Message = "";
    if (pName !== p2Name) {
        p2Message += "-Passwords do not match";
        error = true;
    }

    //email validation
    const email = info.email;
    let eMessage = "";
    if (Validator.isString(email) && email.trim() === "") {
        eMessage += "-Missing email address";
        error = true;
    } else if (!Validator.isEmail(email)) {
        eMessage += "-Unexpected email address";
        error = true;
    }

    //re-entered email
    const email2 = info.email2;
    let e2Message = "";
    if (email !== email2) {
        e2Message += "-Emails do not match";
        error = true;
    }

    //redirect if needed
    if (error) {
        return {
            uMessage,
            pMessage,
            p2Message,
            eMessage,
            e2Message
        }
    }

    return true;
}

export default SignUp;