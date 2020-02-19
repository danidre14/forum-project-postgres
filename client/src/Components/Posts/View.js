import React, { useState, useEffect } from "react";

import Post from "./Post";
import LoadingAnim from "../LoadingAnim";

function PostView() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPosts([
                {
                    id: 1,
                    title: "Post 1",
                    body: "This is the first post about lots of crazy shenannigans lol",
                    username: "Bob",
                    comment_count: 0
                },
                {
                    id: 2,
                    title: "What is Lorem Ipsum?",
                    body: "fghfgfyft",
                    username: "Google"
                },
                {
                    id: 3,
                    title: "Why do we use it?",
                    body: "Lol taskk",
                    comment_count: 3
                }
            ]);
            setIsLoading(false);
        }, 5000)
    }, []);

    const Posts = isLoading ? <LoadingAnim value="Posts" /> : posts.map(post => <Post key={post.id} post={post} canView={true} />);
    return (
        <>
            {Posts}
        </>
    )
}

export default PostView;