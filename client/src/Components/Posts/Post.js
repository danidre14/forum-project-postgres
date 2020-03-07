import React from "react";
import { Link } from "react-router-dom";

function Post(props) {
    const { id, title, username, body, comment_count } = props.post;
    const viewBtn = props.canView ? <Link to={`/posts/view/${id}`}>View</Link> : "";
    return (
        <>
            <p>Post</p>
            <p>id: {id}</p>
            <h3>title: {title}</h3>
            <h3>username: {username || "anonymous"}</h3>
            <div>body: <pre>{body}</pre> </div>
            <p>comments: {comment_count || 0}</p>
            {viewBtn}
        </>
    )
}

export default Post;