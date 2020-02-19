import React from "react";

function Comment(props) {
    const { id, username, body, post_id } = props.comment;

    return (
        <>
            <p>Comment</p>
            <p>id: {id}</p>
            <h3>username: {username || "anonymous"}</h3>
            <p>body: {body}</p>
            <p>Post ID: {post_id}</p>
        </>
    )
}

export default Comment;