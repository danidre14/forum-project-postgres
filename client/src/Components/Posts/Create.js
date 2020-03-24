import React, { useContext } from "react";

import UserContext from "../../context/userContext";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors.jsx";
import useInputChange from "../Utils/useInputChange.jsx";


// import utilities from "../../util/utilities";
// const { Validator } = utilities;
import { Validator } from "../../util/utilities";
// const { Validator } = require("../../util/utilities");
// const Validator = { ...require("validator"), ...require("../../util/utilities") };


import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

function PostCreate(props) {
    const { user } = useContext(UserContext);

    const [{ title, body }, handleInputChange] = useInputChange({
        title: "",
        body: ""
    });

    const [Error, setError] = useErrors(false);

    const createPost = (e) => {
        if (title === "" || body === "") return;
        e.preventDefault();
        if (!user.loggedIn) return setError("Log in to create a post");

        const post = validatePost({ title, body });
        if (!post) return setError("Invalid post");

        function postData() {
            setError(false);
            makeRequest([`/api/v1/posts/`, "post"], { ...post, username: user.username, author_id: user.id }, ({ message: data }) => {
                if (data.message === "Success")
                    props.history.push(`/posts/view/${data.post_id}`);
                else {
                    setError(`Cannot submit post: ${data}`);
                }
            }, (message) => {
                setError(`Cannot submit post: ${message}`);
            });
        }
        postData();
    }

    return (
        <>
            {/* <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" className="text-info">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
            </Breadcrumb> */}
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
                                        disabled
                                        value={user.username || ""}
                                        required={true}
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
                                    required={true}
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
                                required={true}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="info" type="submit" onClick={createPost}>Post</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

const validatePost = ({ title, body }) => {
    const validTitle = Validator.isString(title) && Validator.isLength(title, { min: 1, max: 256 });
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 2048 });
    const post = {}
    if (validTitle && validBody) {
        post.title = title;
        post.body = body;
    } else return false;
    return post;
}

export default PostCreate;