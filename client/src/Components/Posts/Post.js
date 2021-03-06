import React, { useContext, useEffect, useRef, useState } from "react";
import { formatRelative } from 'date-fns';

import UserContext from "../../context/userContext";

import DivLink from "../Utils/DivLink";

import { Card, Badge, Button } from "react-bootstrap";
import { Pencil, Trash, ChatDots, Eye } from "react-bootstrap-icons";
import { withRouter } from "react-router-dom";
import { ChevronCompactUp as UpArrow, ChevronCompactDown as DownArrow } from "react-bootstrap-icons";

import makeRequest from "../Utils/makeRequest";
import MarkDownToUp from "../Utils/MarkDownToUp";

function Post(props) {
    const { user, setNotifValue } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(props.collapseBig);
    const [showCollapsed, setShowCollapsed] = useState(false);

    const postBodyEl = useRef(null);

    const { id, title, username, body, comment_count, view_count, author_id, created_at: date_created, edited_at: date_edited } = props.post;
    const created_at = formatRelative(Date.parse(date_created), Date.now());
    const edited_at = formatRelative(Date.parse(date_edited), Date.now());

    useEffect(() => { if (postBodyEl.current.clientHeight >= 200) setShowCollapsed(true); }, []);

    function editPost() {
        props.history.push(`/posts/edit/${id}`);
    }

    function deletePost() {
        const conf = window.confirm("Are you sure you want to delete this post?");
        if (!conf) return;
        const { request, cancel } = makeRequest();
        function postData() {
            request([`/api/v1/posts/${id}`, "delete"], {}, ({ message: data }) => {
                if (data.message === "Success") {
                    if (!props.canView)
                        props.history.push(data.gotoUrl || `/`);
                    else {
                        props.history.replace("/refresh");
                        props.history.replace("/");
                    }
                    setNotifValue(data.notif || "Post deleted.", 2500);
                } else {
                    if (data.notif) setNotifValue(data.notif, 2500);
                }
            }, (message) => {
                console.log(`Cannot delete post: ${message}`);
            });
        }
        postData();
    }

    const toggleBodyStyle = function () {
        setCollapsed(!collapsed);
    }

    const postBody = MarkDownToUp().convert(body, collapsed);
    const commentsText = (comment_count || 0) + (comment_count === 1 ? " comment" : " comments");
    const postBodyStyle = collapsed ? {
        maxHeight: 200,
        overflow: "hidden"
    } : {};

    const mainPostContent = (<>
        <Card.Title as="h3">{title}</Card.Title>
        <Card.Subtitle className="mb-4 d-flex text-muted small">
            <Card.Text className="mb-0 text-muted mr-auto">by <span className="text-info">{username || "anonymous"}</span>, {created_at}</Card.Text>
            {date_created !== date_edited && <span className="text-muted font-italic">(edited)</span>}
        </Card.Subtitle>
        <div className="mb-3" style={postBodyStyle} ref={postBodyEl}>
            {postBody}
        </div>
    </>)

    return (
        <>
            <Card className={`mb-3 ${props.classNames}`}>
                <Card.Body>
                    {props.canView ? <DivLink to={props.link}>
                        {mainPostContent}
                    </DivLink> :
                        mainPostContent}
                    <hr />
                    <div className="d-flex align-items-center">
                        <Card.Text className="mb-0 mr-auto text-muted">
                            {view_count} <Eye className="mr-3" />
                            {comment_count || 0} <ChatDots />
                            {/* <Badge variant="info">{commentsText}</Badge> */}
                        </Card.Text>
                        {user.id === author_id &&
                            <>
                                <Button variant="link" className="p-0 text-muted" onClick={editPost}>
                                    <Pencil />
                                </Button>
                                <Button variant="link" className="ml-3 p-0 text-muted" onClick={deletePost}>
                                    <Trash />
                                </Button>
                            </>
                        }
                        {props.collapseBig && showCollapsed && <Button variant="link" className="ml-3 p-0 text-muted" onClick={toggleBodyStyle}>
                            {collapsed ? <DownArrow /> : <UpArrow />}
                        </Button>}
                    </div>

                    {props.children}
                </Card.Body>
            </Card>
        </>
    )
}

export default withRouter(Post);