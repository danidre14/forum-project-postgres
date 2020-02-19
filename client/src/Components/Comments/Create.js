import React, { useState, useEffect } from "react";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";
import useInputChange from "../Utils/useInputChange";


const Validator = { ...require("validator"), ...require("../../util/utilities") };

function CommentCreate(props) {
    const [input, handleInputChange, setInput] = useInputChange({
        username: "",
        body: ""
    });

    const [isShowingCreate, setIsShowingCreate] = useState(false);
    const [Error, setError] = useErrors(false);

    const { post_id } = props;

    const createComment = (e) => {
        e.preventDefault();
        const comment = validateComment({ username, body, post_id });
        if (!comment) return setError("Invalid comment");

        // console.log(comment);
        function postData() {
            makeRequest([`/api/v1/comments/${post_id}`, "post"], comment, (data) => {
                props.fetchPost();
                showCommentCreate(false);
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
                username: "",
                body: ""
            });
        }
    }

    const { username, body } = input;

    const commentJSX = isShowingCreate ?
        <>
            <h3>Create Comment</h3>
            <form>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                />

                <label>Body:</label>
                <input
                    type="text"
                    name="body"
                    value={body}
                    onChange={handleInputChange}
                />
                <br />
                <input type="submit" onClick={createComment} value={"Create"} />
            </form>
            <button onClick={() => showCommentCreate(false)}>Cancel</button>
        </> :
        (<button onClick={() => showCommentCreate(true)}>Create Comment</button>)

    return (
        <>
            <Error />
            {commentJSX}
        </>
    )
}

const validateComment = ({ username, body, post_id }) => {
    if (!Validator.isNumber(post_id)) return false;
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 1024 });
    const comment = {}
    if (validBody) {
        comment.body = body;
        comment.post_id = post_id;
    } else return false;
    if (username && Validator.isLength(username, { min: 1, max: 64 })) comment.username = username;
    return comment;
}

export default CommentCreate;