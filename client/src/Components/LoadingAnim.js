import React from "react";

import { Spinner, Row } from "react-bootstrap";

function LoadingAnim({ value }) {
    const loadMsg = value || "Content";
    return (
        <>
            <Row className="justify-content-center">
                <Spinner animation="border" variant="info" role="status">
                    <span className="sr-only">Loading {loadMsg}</span>
                </Spinner>
            </Row>
        </>
    )
}

export default LoadingAnim;