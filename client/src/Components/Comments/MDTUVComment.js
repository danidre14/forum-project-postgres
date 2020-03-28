import React from "react";

import { Card } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function MDTUVComment({ comment }) {
    const { username, body } = comment;
    const postBody = MarkDownToUp().convert(body);

    return (
        <>
            {(body.trim() !== "") ? <>
                <Card.Title as="h3" className="mt-3">Preview</Card.Title>
                <hr />
                <Card.Subtitle className="mb-3">
                    <Card.Text className="mb-0 text-info">{username || "anonymous"}</Card.Text>
                </Card.Subtitle>
                <div>
                    {postBody}
                </div>
            </> : <></>}
        </>
    )
}

export default MDTUVComment;