import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Breadcrumb } from "react-bootstrap";

import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";
import TryCatch from "../Utils/TryCatch";

import Post from "./Post";
import CreateComment from "../Comments/Create";
import Comment from "../Comments/Comment";
import LoadingAnim from "../LoadingAnim";

function PostViewOne(props) {
    const { id } = useParams();
    const post_id = id;

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [Error, setError] = useErrors(false);

    const { request, cancel } = makeRequest();
    function fetchPost(str) {
        request([`/api/v1/posts${str || ""}/${id}`, "get"], {}, (data) => {
            setPost(data);
            setIsLoadingPost(false);
            fetchCommentsPerPost();
        }, (message) => {
            setError(`Cannot view post: ${message}`);
        });
    }
    function fetchCommentsPerPost() {
        request([`/api/v1/comments/${post_id}`, "get"], {}, (data) => {
            setComments(data);
            setIsLoadingComments(false);
        }, (message) => {
            setError(`Cannot view comments: ${message}`);
        });
    }
    useEffect(() => {
        fetchPost("/view");
        return () => cancel();
    }, []);

    const thePost = (isLoadingPost ? <LoadingAnim value="Post" /> :
        <><TryCatch message="Can't load post.">
            <Post classNames={`no-border shadow-sm`} post={post} canView={false}>
                <hr />
                <CreateComment post_id={id} fetchPost={fetchPost} />
            </Post></TryCatch>
        </>);

    const Comments = isLoadingComments ? <LoadingAnim value="Comments" /> : comments.map(comment =>
        <TryCatch key={comment.id} message="Can't load comment."><Comment classNames={`no-border shadow-sm`} comment={{ ...comment, post_id }} fetchPost={fetchPost} />
        </TryCatch>);
    return (
        <>
            <Breadcrumb>
                <li className="breadcrumb-item">
                    <Link to="/" className="text-info">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/posts/view/" className="text-info">Posts</Link>
                </li>
                <Breadcrumb.Item active>{post.title || id}</Breadcrumb.Item>
            </Breadcrumb>
            <Error />
            {thePost}
            {!isLoadingPost && Comments}
        </>
    )
}

export default PostViewOne;