import React, { useState, useEffect } from "react";
import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";

import Comment from "./Comment";
import LoadingAnim from "../LoadingAnim";

function CommentViewPerPost(props) {
    const { post_id, fetchCommentsPerPost } = props;

    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Error, setError] = useErrors(false);


    useEffect(() => {
        fetchCommentsPerPost(post_id, (data) => {
            setComments(data);
            setIsLoading(false);
        }, (message) => {
            setError(`Cannot view comments: ${message}`);
        });
    }, []);

    const Comments = isLoading ? <LoadingAnim value="Comments" /> : comments.map(comment => <Comment key={comment.id} comment={{ ...comment, post_id }} />);
    return (
        <>
            <Error />
            <p>Comments:</p>
            {Comments}
        </>
    )
}

export default CommentViewPerPost;