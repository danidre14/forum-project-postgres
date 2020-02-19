import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Post from "./Post";
import CreateComment from "../Comments/Create";
import CommentViewPerPost from "../Comments/ViewPerPost";
import LoadingAnim from "../LoadingAnim";

function PostViewOne() {
    const { id } = useParams();

    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPost({
                id: id,
                title: "Post 1",
                body: "This is the first post about lots of crazy shenannigans lol",
                username: "Bob",
                comment_count: 0
            });
            setIsLoading(false);
        }, 5000)
    }, []);

    const Post_ = isLoading ? <LoadingAnim value="Posts" /> :
        <>
            <Post post={post} canView={false} />
            <hr />
            <CreateComment post_id={id} />
            <hr />
            <CommentViewPerPost post_id={id} />
        </>;
    return (
        <>
            {Post_}
        </>
    )
}

export default PostViewOne;