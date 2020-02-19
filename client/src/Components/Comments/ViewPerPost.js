import React, { useState, useEffect } from "react";

import Comment from "./Comment";
import LoadingAnim from "../LoadingAnim";

function CommentViewPerPost(props) {
    const { post_id } = props;

    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setComments([
                {
                    id: 1,
                    body: "This is the first comment about lots of crazy shenannigans lol",
                    username: "Bob"
                },
                {
                    id: 2,
                    body: "fghfgfyft",
                    username: "Google"
                },
                {
                    id: 3,
                    body: "Lol taskk"
                }
            ]);
            setIsLoading(false);
        }, 5000)
    }, []);

    const Comments = isLoading ? <LoadingAnim value="Comments" /> : comments.map(comment => <Comment key={comment.id} comment={{ ...comment, post_id }} />);
    return (
        <>
            <p>Comments:</p>
            {Comments}
        </>
    )
}

export default CommentViewPerPost;