import React from "react";

import { Card } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function MDTUVPost({ post }) {
    const { title, username, body } = post;
    const postBody = MarkDownToUp().convert(body);

    return (
        <>
            {(title.trim() !== "" || body.trim() !== "") ? <>
                <Card className={"mb-3 no-border shadow-sm"}>
                    <Card.Body>
                        <Card.Title as="h2">Preview</Card.Title>
                        <hr />
                        <Card.Title as="h3">{title}</Card.Title>
                        <Card.Subtitle className="mb-4 text-muted small">
                            <Card.Text className="mb-0 text-muted mr-auto">by <span className="text-info">{username || "anonymous"}</span></Card.Text>
                        </Card.Subtitle>
                        <div className="mb-3">
                            {postBody}
                        </div>
                    </Card.Body>
                </Card>
            </> : <></>}
        </>
    )
}

export default MDTUVPost;