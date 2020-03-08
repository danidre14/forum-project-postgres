import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import makeRequest from "../Utils/makeRequest.jsx";
import useErrors from "../Utils/useErrors.jsx";

import Post from "./Post";
import CreateComment from "../Comments/Create";
import Comment from "../Comments/Comment";
import LoadingAnim from "../LoadingAnim";

function PostViewOne() {
    const { id } = useParams();
    const post_id = id;

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [Error, setError] = useErrors(false);

    function fetchPost() {
        makeRequest([`/api/v1/posts/${id}`, "get"], {}, (data) => {
            setPost(data);
            setIsLoadingPost(false);
            fetchCommentsPerPost();
        }, (message) => {
            setError(`Cannot view post: ${message}`);
        })
    }
    function fetchCommentsPerPost() {
        makeRequest([`/api/v1/comments/${post_id}`, "get"], {}, (data) => {
            setComments(data);
            setIsLoadingComments(false);
        }, (message) => {
            setError(`Cannot view comments: ${message}`);
        });
    }
    useEffect(() => {
        fetchPost();
    }, []);

    const thePost = (isLoadingPost ? <LoadingAnim value="Posts" /> :
        <>
            <Post post={post} canView={false} />
            <hr />
            <CreateComment post_id={id} fetchPost={fetchPost} />
        </>);

    const Comments = isLoadingComments ? <LoadingAnim value="Comments" /> : comments.map(comment => <Comment key={comment.id} comment={{ ...comment, post_id }} />);
    return (
        <>
            <Error />
            {thePost}
            <hr />
            {Comments}
        </>
    )
}

export default PostViewOne;