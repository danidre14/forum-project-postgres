import React, { useContext, useState, useEffect } from "react";

import { Prompt } from "react-router";
import { useParams, Link } from "react-router-dom";

import UserContext from "../../context/userContext";

import makeRequest from "../Utils/makeRequest";
import ErrorsBox from "../Utils/ErrorsBox";
import useInputChange from "../Utils/useInputChange";

import MDTUVPost from "./MDTUVPost";

import LoadingAnim from "../LoadingAnim";

import Head from "../Utils/Head";

import { Validator } from "../../util/utilities";


import { Card, Form, Col, Row, InputGroup, Button, Breadcrumb } from 'react-bootstrap';

function PostEdit(props) {
    const { user, setNotifValue } = useContext(UserContext);
    const { id } = useParams();

    const [{ title, body }, handleInputChange, setState] = useInputChange({
        title: "",
        body: ""
    });
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [intervalID, setIntervalID] = useState(0);
    const [sentPost, setSentPost] = useState(false);

    const [originalPost, setPost] = useState({});
    const [Error, setError] = ErrorsBox(false);
    const { request, cancel } = makeRequest();

    function editPost(e) {
        if (title === "" || body === "") return;
        e.preventDefault();
        if (!user.signedIn) return setError("Sign In to edit a post");

        const post = validatePost({ title, body });
        if (!post) return setError("Invalid post");
        if (post.title === originalPost.title && post.body === originalPost.body) {
            return setNotifValue("No changes detected.", 5000);
        }

        function postData() {
            setError(false);
            request([`/api/v1/posts/${id}`, "put"], { ...post, username: user.username, author_id: user.id }, ({ message: data }) => {
                if (data.message === "Success") {
                    setSentPost(true);
                    props.history.push(`/posts/view/${data.post_id}`);
                    setNotifValue(data.notif || "Changes saved.", 5000);
                } else {
                    if (data.notif) setNotifValue(data.notif, 5000);
                }
            }, (message) => {
                setError(`Cannot submit post: ${message}`);
            });
        }
        postData();
    }
    useEffect(() => {
        function fetchPost() {
            request([`/api/v1/posts/${id}`], {}, (data) => {
                setPost(data);
                setState({ title: data.title, body: data.body });
                setIsLoadingPost(false);
            }, (message) => {
                setError(`Cannot view post: ${message}`);
            })
        }
        fetchPost();

        let intervalId = setInterval(() => {
            function pingServer() {
                request([`/api/v1/ping`]);
            }
            pingServer();
        }, 60 * 1000);
        setIntervalID(intervalId);

        return () => {
            clearInterval(intervalID);
            cancel();
        }
    }, []);

    useEffect(() => {
        if (!sentPost&&(title !== (originalPost.title||"") || body !== (originalPost.body||""))) {
            window.onbeforeunload = () => true;
        } else {
            window.onbeforeunload = undefined;
        }
        return () => window.onbeforeunload = undefined;
    }, [sentPost, title, body]);

    return (
        <>
        <Head page={{ title: "Edit Post", description: "Edit post on Dani-Smorum." }} />
            <Prompt
                when={!sentPost&&(title !== (originalPost.title||"") || body !== (originalPost.body||""))}
                message='You have unsaved changes, are you sure you want to leave?'
            />
            <Breadcrumb>
                <li className="breadcrumb-item">
                    <Link to="/" className="text-info">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/posts/view/" className="text-info">Posts</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to={`/posts/view/${id}`} className="text-info">{originalPost.title || id}</Link>
                </li>
                <Breadcrumb.Item active>Edit</Breadcrumb.Item>
            </Breadcrumb>
            {isLoadingPost ? <LoadingAnim value="Post" /> : <>
                <Card className="mb-3 no-border shadow-sm">
                    <Card.Body>
                        <Card.Title as="h2" className="mb-3">Edit Post</Card.Title>
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
                            <Button variant="info" type="submit" onClick={editPost}>Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <MDTUVPost post={{ title, body, username: user.username }} />
            </>}
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

export default PostEdit;