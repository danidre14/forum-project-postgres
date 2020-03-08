import React from "react";

import { Card, Row, Col } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function Comment(props) {
    const { id, username, body, post_id } = props.comment;
    const postBody = MarkDownToUp().convert(body);

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">
                        <Row>
                            <Col>{username || "anonymous"}</Col>
                            <Col xs="auto">x minutes ago</Col>
                        </Row>
                    </Card.Subtitle>
                    <div>
                        {postBody}
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default Comment;