import React, { useState, useEffect } from "react";

import useInputChange from "../States/useInputChange";

function PostCreate() {
    const [{ username, title, body }, handleInputChange] = useInputChange({
        username: "",
        title: "",
        body: ""
    });

    const createPost = (e) => {
        e.preventDefault();
        console.log({ username, title, body });
    }

    return (
        <>
            <form>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                />
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                />
                <label>Body:</label>
                <input
                    type="text"
                    name="body"
                    value={body}
                    onChange={handleInputChange}
                />
                <input type="submit" onClick={createPost} />
            </form>
        </>
    )
}

export default PostCreate;