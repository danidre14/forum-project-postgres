import React from "react";

import { Link } from "react-router-dom";

import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

import useErrors from "../Utils/useErrors.jsx";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange.jsx";

function SignUp(props) {
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

        console.log("tried to sign up");

        const user = { username, email, email2, password, password2 }//validatePost({ username, title, body });
        // if (!post) return setError("Invalid post");

        function postData() {
            setError(false);
            makeRequest([`/api/v1/signup/`, "post"], user, ({ message: data }) => {
                if (data.message === "Success") {
                    console.log("Make notification", data.notif);
                    props.history.push(data.gotoUrl || `/signin/`);
                    // props.history.push(`/signup/verify`);
                } else {
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

const validateForm = ({ name, email, password }) => {
    const validTitle = Validator.isString(title) && Validator.isLength(title, { min: 1, max: 256 });
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 2048 });
    const post = {}
    if (validTitle && validBody) {
        post.title = title;
        post.body = body;
    } else return false;
    if (username && Validator.isLength(username, { min: 1, max: 64 })) post.username = username;
    return post;
}

export default SignUp;