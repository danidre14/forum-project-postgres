import React, { useState, useEffect } from "react";
import makeRequest from "../Utils/makeRequest";
import useErrors from "../Utils/useErrors";

import DivLink from "../Utils/DivLink";

import Post from "./Post";
import LoadingAnim from "../LoadingAnim";
import TryCatch from "../Utils/TryCatch";

import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function PostView() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Error, setError] = useErrors(false);

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
        // <TryCatch key={post.id}><DivLink key={post.id} to={`/posts/view/${post.id}`}>
        //     <Post classNames={`no-border shadow-sm`} key={post.id} post={post} canView={true} />
        // </DivLink></TryCatch>
        <TryCatch key={post.id}><DivLink to={`/posts/view/${post.id}`}>
            <Post classNames={`no-border shadow-sm`} post={post} canView={true} />
        </DivLink></TryCatch>
    );
    return (
        <>
            {/* <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" className="text-info">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Posts</Breadcrumb.Item>
            </Breadcrumb> */}
            <Error />
            {Posts}
        </>
    )
}

export default PostView;