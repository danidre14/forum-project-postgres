import React, { useEffect, useContext } from "react";

import UserContext from "../../context/userContext";

import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

import useErrors from "../Utils/useErrors";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange";

import { parseQueryString } from "../../util/utilities";

function SignUpVerify(props) {
    const { setNotifValue } = useContext(UserContext);
    const [Error, setError] = useErrors(false);
    const query = props.location.search;
    const { token } = parseQueryString(query);

    const [{ username, email }, handleInputChange] = useInputChange({
        username: "",
        email: ""
    });

    useEffect(() => {
        if (!token)
            props.history.push(`/signup/`);
    }, []);

    const doSignUpVerify = (e) => {
        if (username === "" || email === "") return;
        e.preventDefault();

        const user = { username, email, token }

        function postData() {
            setError(false);
            const { request, cancel } = makeRequest();
            request([`/api/v1/signup/verify${query}`, "post"], user, ({ message: data }) => {
                if (data.message === "Success") {
                    props.history.push(`/signin/`, 10000);
                    setNotifValue(data.notif);
                } else {
                    setError(data);
                }
            }, (message) => {
                setError("Cannot sign up: " + message);
            });
        }
        postData();
    }

    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                    <Card.Title as="h2" className="mb-3">Verify Account</Card.Title>
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
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="auto">Email</Form.Label>
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
                        <Button variant="info" type="submit" onClick={doSignUpVerify}>Verify</Button>
                    </Form>
                    <Error />
                </Card.Body>
            </Card>
        </>
    );
}

export default SignUpVerify;