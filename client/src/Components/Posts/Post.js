import React from "react";

import { Card, Badge } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function Post(props) {
    const { id, title, username, body, comment_count } = props.post;
    const postBody = MarkDownToUp().convert(body);
    const commentsText = (comment_count || 0) + (comment_count === 1 ? " comment" : " comments");
    return (
        <>
            <Card className={`mb-3 ${props.classNames}`}>
                <Card.Body>
                    <Card.Title as="h3">{title}</Card.Title>
                    <Card.Subtitle className="mb-4 text-muted small">
                        by <span className="text-info">{username || "anonymous"}</span>, x minutes ago
                    </Card.Subtitle>
                    <div className="mb-3">
                        {postBody}
                    </div>
                    <Card.Text>
                        <Badge variant="info">{commentsText}</Badge>
                    </Card.Text>
                    {props.children}
                </Card.Body>
            </Card>
        </>
    )
}

export default Post;