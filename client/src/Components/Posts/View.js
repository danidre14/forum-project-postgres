import React, { useState, useEffect } from "react";
import makeRequest from "../Utils/makeRequest.jsx";
import useErrors from "../Utils/useErrors.jsx";

import Post from "./Post";
import LoadingAnim from "../LoadingAnim";

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

    const Posts = isLoading ? <LoadingAnim value="Posts" /> : posts.map(post => <Post key={post.id} post={post} canView={true} />);
    return (
        <>
            <Error />
            {Posts}
        </>
    )
}

export default PostView;