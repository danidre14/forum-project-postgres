import React, { useContext } from "react";
import { formatRelative } from 'date-fns';

import UserContext from "../../context/userContext";

import { Card, Row, Col, Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

import makeRequest from "../Utils/makeRequest";
import MarkDownToUp from "../Utils/MarkDownToUp";

function Comment(props) {
    const { user, setNotifValue } = useContext(UserContext);

    const { id, username, body, post_id, author_id, created_at: date_created } = props.comment;
    const created_at = formatRelative(Date.now(), Date.parse(date_created));
    const postBody = MarkDownToUp().convert(body);


    function deleteComment() {
        const { request, cancel } = makeRequest();
        function postData() {
            request([`/api/v1/comments/${id}`, "delete"], {}, ({ message: data }) => {
                if (data.message === "Success") {
                    props.fetchPost();
                    setNotifValue(data.notif || "Comment deleted.", 2500);
                } else {
                    if (data.notif) setNotifValue(data.notif, 2500);
                }
            }, (message) => {
                console.log(`Cannot delete comment: ${message}`);
            })
        }
        postData();
    }

    return (
        <>
            <Card className={`mb-3 ${props.classNames}`}>
                <Card.Body>
                    <Card.Subtitle className="mb-3 d-flex align-items-center">
                        <Card.Text className="mb-0 text-info mr-auto">{username || "anonymous"}</Card.Text>
                        <span className="text-muted">{created_at}</span>
                        {user.id === author_id &&
                            <Button variant="link" className="ml-3 p-0" onClick={deleteComment}>
                                <Trash />
                            </Button>
                        }
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