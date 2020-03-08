import React from "react";

import { Card, Row, Col } from "react-bootstrap";

import MarkDownToUp from "../Utils/MarkDownToUp";

function Comment(props) {
    const { id, username, body, post_id } = props.comment;
    const postBody = MarkDownToUp().convert(body);

    return (
        <>
            <Card className={`mb-3 ${props.classNames}`}>
                <Card.Body>
                    <Card.Subtitle className="mb-3">
                        <Row>
                            <Col className="text-info">{username || "anonymous"}</Col>
                            <Col xs="auto" className="text-muted">x minutes ago</Col>
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