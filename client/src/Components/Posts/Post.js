import React, { useContext } from "react";
import { formatRelative } from 'date-fns';

import UserContext from "../../context/userContext";

import { Card, Badge, Button } from "react-bootstrap";
import { Pencil, Trash, ChatDots, Eye, CircleFill } from "react-bootstrap-icons";
import { withRouter } from "react-router-dom";

import makeRequest from "../Utils/makeRequest";
import MarkDownToUp from "../Utils/MarkDownToUp";

function Post(props) {
    const { user, setNotifValue } = useContext(UserContext);

    const { id, title, username, body, comment_count, view_count, author_id, created_at: date_created, edited_at: date_edited } = props.post;
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
                    <div className="d-flex align-items-center">
                        <Card.Text className="mb-0 mr-auto text-muted">
                            {view_count} <Eye className="mr-3" />
                            {comment_count || 0} <ChatDots />
                            {/* <Badge variant="info">{commentsText}</Badge> */}
                        </Card.Text>
                        {user.id === author_id ?
                            (!props.canView ? <>
                                <Button variant="link" className="p-0 text-muted" onClick={editPost}>
                                    <Pencil />
                                </Button>
                                <Button variant="link" className="ml-3 p-0 text-muted" onClick={deletePost}>
                                    <Trash />
                                </Button>
                            </>
                                : <>
                                    <Card.Text className="m-0 text-muted">
                                        <CircleFill />
                                    </Card.Text>
                                </>
                            ) : <></>}
                    </div>

                    {props.children}
                </Card.Body>
            </Card>
        </>
    )
}

export default withRouter(Post);