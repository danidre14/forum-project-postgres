import React from "react";

import makeRequest from "../Utils/makeRequest.jsx";
import useErrors from "../Utils/useErrors.jsx";
import useInputChange from "../Utils/useInputChange.jsx";


const Validator = { ...require("validator"), ...require("../../util/utilities") };

import { Link } from "react-router-dom";

import { Card, Breadcrumb } from "react-bootstrap";


import { Form, Col, Row, InputGroup, Button } from 'react-bootstrap';

function PostCreate(props) {
    const [{ username, title, body }, handleInputChange] = useInputChange({
        username: "",
        title: "",
        body: ""
    });

    const [Error, setError] = useErrors(false);

    const createPost = (e) => {
        e.preventDefault();
        const post = validatePost({ username, title, body });
        if (!post) return setError("Invalid post");

        function postData() {
            makeRequest([`/api/v1/posts/`, "post"], post, (data) => {
                props.history.push(`/posts/view/${data.id}`)
            }, (message) => {
                setError(`Cannot post blog: ${message}`);
            })
        }
        postData();
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" className="text-info">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
            </Breadcrumb>
            <Card className="mb-3 no-border shadow-sm">
                <Card.Body>
                    <Error />
                    <Form>
                        <Form.Group as={Row} controlId="formBasicUsername">
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
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formBasicTitle">
                            <Form.Label column sm="auto">Title</Form.Label>
                            <Col>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Title"
                                    name="title"
                                    value={title}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="formBasicBody">
                            <Form.Control
                                as="textarea"
                                rows="12"
                                placeholder="What's on your mind?"
                                name="body"
                                value={body}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="info" type="submit" onClick={createPost}>
                            Post
                    </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

const validatePost = ({ username, title, body }) => {
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

export default PostCreate;