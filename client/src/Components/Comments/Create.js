import React, { useState, useContext } from "react";

import UserContext from "../../context/userContext";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors.jsx";
import useInputChange from "../Utils/useInputChange.jsx";


// import utilities from "../../util/utilities";
// const { Validator } = utilities;
import { Validator } from "../../util/utilities";
// const Validator = { ...require("validator"), ...require("../../util/utilities") };

import { Link } from "react-router-dom";

import { Form, Button, Col, Row, InputGroup, ButtonToolbar } from "react-bootstrap";

function CommentCreate(props) {
    const [{ body }, handleInputChange, setInput] = useInputChange({
        body: ""
    });

    const [isShowingCreate, setIsShowingCreate] = useState(false);
    const [Error, setError] = useErrors(false);

    const { post_id } = props;
    const { user } = useContext(UserContext);

    const createComment = (e) => {
        if (body === "") return;
        e.preventDefault();
        if (!user.loggedIn) return setError("Sign in or sign up to comment on this post.");

        const comment = validateComment({ body, post_id });
        if (!comment) return setError("Invalid comment");

        function postData() {
            setError(false);
            const { request, cancel } = makeRequest();
            request([`/api/v1/comments/${post_id}`, "post"], { ...comment, username: user.username, author_id: user.id }, ({ message: data }) => {
                if (data.message === "Success") {
                    props.fetchPost();
                    showCommentCreate(false);
                } else
                    setError(`Cannot post comment: ${data}`);
            }, (message) => {
                setError(`Cannot post comment: ${message}`);
            });
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
        if (!user.loggedIn) {
            return (
                <>
                    <p>Only users can post comments. <Link to="/signin"> Sign in</Link> or <Link to="/signup"> sign up</Link> to comment on this post.</p>
                    <Button variant="info" onClick={() => { showCommentCreate(false); setError(false) }}>
                        Cancel
                        </Button>
                </>
            )
        }
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
                                    placeholder="username"
                                    name="username"
                                    disabled
                                    value={user.username || ""}
                                    required={true}
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
                            required={true}
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
            </>
        )
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