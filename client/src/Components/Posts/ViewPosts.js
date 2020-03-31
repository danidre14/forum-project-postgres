import React, { useState, useEffect } from "react";
import makeRequest from "../Utils/makeRequest";
import ErrorsBox from "../Utils/ErrorsBox";

import Head from "../Utils/Head";

import DivLink from "../Utils/DivLink";

import Post from "./Post";
import LoadingAnim from "../LoadingAnim";
import TryCatch from "../Utils/TryCatch";

import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function PostView() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Error, setError] = ErrorsBox(false);

    useEffect(() => {
        const { request, cancel } = makeRequest();
        function getData() {
            request(["/api/v1/posts", "get"], {}, (data) => {
                setPosts(data);
                setIsLoading(false);
            }, (message) => {
                setError(`Cannot view posts: ${message}`);
            })
        }
        getData();
        return () => cancel();
    }, []);

    const Posts = isLoading ? <LoadingAnim value="Posts" /> : posts.map(post =>
        <TryCatch key={post.id}>
            <Post classNames={`no-border shadow-sm`} post={post} canView={true} link={`/posts/view/${post.id}`} />
        </TryCatch>
    );
    return (
        <>
            <Head page={{ title: "Browse", description: "Browse posts on Dani Smorum." }} />
            <Breadcrumb>
                <li className="breadcrumb-item">
                    <Link to="/" className="text-info">
                        Home
                    </Link>
                </li>
                <Breadcrumb.Item active>Posts</Breadcrumb.Item>
            </Breadcrumb>
            <Error />
            {Posts}
        </>
    )
}

export default PostView;