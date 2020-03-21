import React, { useState } from "react";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors.jsx";
import useInputChange from "../Utils/useInputChange.jsx";


import utilities from "../../util/utilities";
const { Validator } = utilities;
// const Validator = { ...require("validator"), ...require("../../util/utilities") };

import { Form, Button, Col, Row, InputGroup, ButtonToolbar } from "react-bootstrap";

function CommentCreate(props) {
    const [{ body }, handleInputChange, setInput] = useInputChange({
        body: ""
    });

    const [isShowingCreate, setIsShowingCreate] = useState(false);
    const [Error, setError] = useErrors(false);

    const { post_id, user } = props;

    const createComment = (e) => {
        e.preventDefault();
        if (!user.loggedIn) return setError("Sign in to comment on this post.");

        const comment = validateComment({ body, post_id });
        if (!comment) return setError("Invalid comment");

        function postData() {
            makeRequest([`/api/v1/comments/${post_id}`, "post"], { ...comment, username: user.username, author_id: user.id }, (data) => {
                props.fetchPost();
                showCommentCreate(false);
                setError(false);
            }, (message) => {
                setError(`Cannot post comments: ${message}`);
            })
        }
        postData();
    }

    const showCommentCreate = (val) => {
        if (val) {
            setIsShowingCreate(true);
        } else {
            setIsShowingCreate(false);
            setInput({
                body: ""
            });
        }
    }

    if (isShowingCreate) {
        return (
            <>
                <Error />

                <p className="mb-3 text-muted">Create Comment</p>
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
                                    value={user.username}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="formBasicBody">
                        <Form.Control
                            as="textarea"
                            rows="4"
                            placeholder="What are your thoughts?"
                            name="body"
                            value={body}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <ButtonToolbar>
                        <Button variant="info" type="submit" onClick={createComment} className="mr-3">
                            Comment
                            </Button>
                        <Button variant="info" onClick={() => { showCommentCreate(false); setError(false) }}>
                            Cancel
                            </Button>
                    </ButtonToolbar>
                </Form>

            </>
        )
    } else {
        return (
            <>
                <Error />
                <Button variant="info" onClick={() => showCommentCreate(true)}>Comment</Button>
            </>)
    }
}

const validateComment = ({ body, post_id }) => {
    if (!Validator.isNumber(post_id)) return false;
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 1024 });
    const comment = {}
    if (validBody) {
        comment.body = body;
        comment.post_id = post_id;
    } else return false;
    return comment;
}

export default CommentCreate;