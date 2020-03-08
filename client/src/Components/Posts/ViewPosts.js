import React, { useState, useEffect } from "react";
import makeRequest from "../Utils/makeRequest.jsx";
import useErrors from "../Utils/useErrors.jsx";

import DivLink from "../Utils/DivLink.jsx";

import Post from "./Post";
import LoadingAnim from "../LoadingAnim";

import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function PostView() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Error, setError] = useErrors(false);

    useEffect(() => {
        function getData() {
            makeRequest(["/api/v1/posts", "get"], {}, (data) => {
                setPosts(data);
                setIsLoading(false);
            }, (message) => {
                setError(`Cannot view posts: ${message}`);
            })
        }
        getData();
    }, []);

    const Posts = isLoading ? <LoadingAnim value="Posts" /> : posts.map(post =>
        <DivLink to={`/posts/view/${post.id}`}>
            <Post key={post.id} post={post} canView={true} />
        </DivLink>);
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" className="text-info">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Posts</Breadcrumb.Item>
            </Breadcrumb>
            <Error />
            {Posts}
        </>
    )
}

export default PostView;