import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Breadcrumb } from "react-bootstrap";

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
    const [postTitle, setPostTitle] = useState("");
    const [comments, setComments] = useState([]);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [Error, setError] = useErrors(false);

    function fetchPost() {
        makeRequest([`/api/v1/posts/${id}`, "get"], {}, (data) => {
            setPost(data);
            setPostTitle(data.title);
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
            <Post post={post} canView={false}>
                <hr />
                <CreateComment post_id={id} fetchPost={fetchPost} />
            </Post>
        </>);

    const Comments = isLoadingComments ? <LoadingAnim value="Comments" /> : comments.map(comment => <Comment classNames={`no-border shadow-sm`} key={comment.id} comment={{ ...comment, post_id }} />);
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" className="text-info">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/posts/view" className="text-info">Posts</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{postTitle}</Breadcrumb.Item>
            </Breadcrumb>
            <Error />
            {thePost}
            {!isLoadingPost && Comments}
        </>
    )
}

export default PostViewOne;