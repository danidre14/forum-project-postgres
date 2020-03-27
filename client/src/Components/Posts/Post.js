import React, { useContext } from "react";
import { formatRelative } from 'date-fns';

import UserContext from "../../context/userContext";

import { Card, Badge, Col, Row, Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Link, withRouter } from "react-router-dom";

import makeRequest from "../Utils/makeRequest";
import MarkDownToUp from "../Utils/MarkDownToUp";

function Post(props) {
    const { user, setNotifValue } = useContext(UserContext);

    const { id, title, username, body, comment_count, author_id, created_at: date_created, edited_at: date_edited } = props.post;
    const created_at = formatRelative(Date.parse(date_created), Date.now());
    const edited_at = formatRelative(Date.parse(date_edited), Date.now());

    function editPost() {
        props.history.push(`/posts/edit/${id}`);
    }

    function deletePost() {
        const { request, cancel } = makeRequest();
        function postData() {
            request([`/api/v1/posts/${id}`, "delete"], {}, ({ message: data }) => {
                if (data.message === "Success") {
                    props.history.push(data.gotoUrl || `/`);
                    setNotifValue(data.notif || "Post deleted.", 2500);
                } else {
                    if (data.notif) setNotifValue(data.notif, 2500);
                }
            }, (message) => {
                console.log(`Cannot delete post: ${message}`);
            })
        }
        postData();
    }

    const postBody = MarkDownToUp().convert(body);
    const commentsText = (comment_count || 0) + (comment_count === 1 ? " comment" : " comments");

    return (
        <>
            <Card className={`mb-3 ${props.classNames}`}>
                <Card.Body>
                    <Card.Title as="h3">{title}</Card.Title>
                    <Card.Subtitle className="mb-4 d-flex text-muted small">
                        <Card.Text className="mb-0 text-muted mr-auto">by <span className="text-info">{username || "anonymous"}</span>, {created_at}</Card.Text>
                        {date_created !== date_edited && <span className="text-muted font-italic">(edited)</span>}
                    </Card.Subtitle>
                    <div className="mb-3">
                        {postBody}
                    </div>
                    <hr />
                    <div className="d-flex">
                        <Card.Text className="mb-0 mr-auto">
                            <Badge variant="info">{commentsText}</Badge>
                        </Card.Text>
                        {user.id === author_id && !props.canView && <>
                            <Button variant="link" className="p-0" onClick={editPost}>
                                <Pencil />
                            </Button>
                            <Button variant="link" className="ml-3 p-0" onClick={deletePost}>
                                <Trash />
                            </Button>
                        </>}
                    </div>

                    {props.children}
                </Card.Body>
            </Card>
        </>
    )
}

export default withRouter(Post);