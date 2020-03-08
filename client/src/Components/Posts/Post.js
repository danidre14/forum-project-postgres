import React from "react";
import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function Post(props) {
    const { id, title, username, body, comment_count } = props.post;
    const titleText = props.canView ? <Link to={`/posts/view/${id}`}>{title}</Link> : title;
    const postBody = MarkDownToUp().convert(body);
    const commentsText = (comment_count || 0) + (comment_count === 1 ? " comments" : " comment");
    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title as="h3">{titleText}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">by {username || "anonymous"}, x minutes ago</Card.Subtitle>
                    <div>
                        {postBody}
                    </div>
                    <Card.Text>{commentsText}</Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default Post;