import React from "react";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";
import useInputChange from "../Utils/useInputChange";


const Validator = { ...require("validator"), ...require("../../util/utilities") };


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
            <Error />
            <Form>
                <Form.Group as={Row} controlId="formBasicUsername">
                    <Form.Label column sm="2">Username</Form.Label>
                    <Col sm="10">

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
                    <Form.Label column sm="2">Title</Form.Label>
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
                        placeholder="Create post"
                        name="body"
                        value={body}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button variant="info" type="submit" onClick={createPost}>
                    Create
                    </Button>
            </Form>
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