import React, { useContext, useState, useEffect } from "react";

import UserContext from "../../context/userContext";

import ErrorsBox from "../Utils/ErrorsBox";
import useInputChange from "../Utils/useInputChange";
import Head from "../Utils/Head";

import MDTUVPost from "./MDTUVPost";

import { Validator } from "../../util/utilities";

import { Link } from "react-router-dom";
import { Prompt } from "react-router";
import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

import makeRequest from "../Utils/makeRequest";

function PostCreate(props) {
    const { user, setNotifValue } = useContext(UserContext);
    const [intervalID, setIntervalID] = useState(0);
    const [sentPost, setSentPost] = useState(false);

    const [{ title, body }, handleInputChange] = useInputChange({
        title: "",
        body: ""
    });

    useEffect(() => {
        const { request, cancel } = makeRequest();
        let intervalId = setInterval(() => {
            function pingServer() {
                request([`/api/v1/ping`]);
            }
            pingServer();
        }, 20 * 60 * 1000);
        setIntervalID(intervalId);


        return () => {
            clearInterval(intervalID);
            cancel();
        }
    }, []);

    useEffect(() => {
        if (!sentPost&&(title !== "" || body !== "")) {
            window.onbeforeunload = () => true;
        } else {
            window.onbeforeunload = undefined;
        }
        return () => window.onbeforeunload = undefined;
    }, [sentPost, title, body]);

    const [Error, setError] = ErrorsBox(false);

    const createPost = (e) => {
        if (title === "" || body === "") return;
        e.preventDefault();
        if (!user.signedIn) return setError("Sign In to create a post");

        const post = validatePost({ title, body });
        if (!post) return setError("Invalid post");

        function postData() {
            setError(false);
            const { request, cancel } = makeRequest();
            request([`/api/v1/posts/`, "post"], { ...post, username: user.username, author_id: user.id }, ({ message: data }) => {
                if (data.message === "Success") {
                    setSentPost(true);
                    props.history.push(`/posts/view/${data.post_id}`);
                    setNotifValue(data.notif || "Post created.", 5000);
                } else if (data.notif)
                    setNotifValue(data.notif, 5000);
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
        <Head page={{ title: "Create Post", description: "Create a post on Dani-Smorum." }} />
            <Prompt
                when={!sentPost&&(title !== "" || body !== "")}
                message='You have unsaved changes, are you sure you want to leave this page?'
            />
            <Breadcrumb>
                <li className="breadcrumb-item">
                    <Link to="/" className="text-info">Home</Link>
                </li>
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
            </Breadcrumb>
            <Card className="mb-3 no-border shadow-sm">
                <Card.Body>
                    <Card.Title as="h2" className="mb-3">Create Post</Card.Title>
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
            <MDTUVPost post={{ title, body, username: user.username }} />
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