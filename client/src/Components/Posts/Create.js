import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";
import useInputChange from "../Utils/useInputChange";


const Validator = { ...require("validator"), ...require("../../util/utilities") };

function PostCreate(props) {
    const history = useHistory()
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

        // console.log(post);
        function postData() {
            makeRequest([`/api/v1/posts/`, "post"], post, (data) => {
                // history.goBack();
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
            <form>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                />
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                />
                <label>Body:</label>
                <input
                    type="text"
                    name="body"
                    value={body}
                    onChange={handleInputChange}
                />
                <input type="submit" onClick={createPost} />
            </form>
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