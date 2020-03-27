import React, { useContext } from "react";

import UserContext from "../../context/userContext";

import { Link } from "react-router-dom";

import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

import useErrors from "../Utils/useErrors";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange";

function SignIn(props) {
    const { signInUser, setNotifValue } = useContext(UserContext);
    const [Error, setError] = useErrors(false);

    const [{ usernameOrEmail, password }, handleInputChange] = useInputChange({
        usernameOrEmail: "",
        password: "",
    });

    const doSignIn = (e) => {
        if (usernameOrEmail === "" || password === "") return;
        e.preventDefault();


        // return;
        const post = { usernameOrEmail, password }//validatePost({ username, title, body });
        // if (!post) return setError("Invalid post");

        function postData() {
            setError(false);
            const { request, cancel } = makeRequest();
            request([`/api/v1/signin/`, "post"], post, ({ message: data }) => {
                if (data.message === "Success") {
                    const user = { username: data.username, id: data.id };
                    signInUser(user);
                    // props.history.goBack();
                    props.history.push(`/`);
                    setNotifValue(`Successfully signed in. Welcome, ${user.username}!`, 5000);
                } else
                    setError("Failed Sign In: " + data);
            }, (message) => {
                setError("Error: " + message);
            });
        }
        postData();
    }

    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                    <Card.Title as="h2" className="mb-3">Sign In</Card.Title>
                    <Form className="mb-3">
                        <Form.Group as={Row} controlId="usernameOrEmail">
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
                                        name="usernameOrEmail"
                                        value={usernameOrEmail}
                                        required={true}
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="password">
                            <Form.Label column sm="auto">Password</Form.Label>
                            <Col>
                                <Form.Control
                                    size="sm"
                                    type="password"
                                    placeholder="Username"
                                    name="password"
                                    value={password}
                                    required={true}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                        <Button variant="info" type="submit" onClick={doSignIn}>Sign In</Button>
                    </Form>
                    <Error />
                    <hr />
                    <Card.Text>Don't have an account? <Link to="/signup">Sign Up</Link></Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}

export default SignIn;