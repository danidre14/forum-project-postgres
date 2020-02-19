import React, { useState, useEffect } from "react";

import useInputChange from "../States/useInputChange";

function CommentCreate(props) {
    const [input, handleInputChange, setInput] = useInputChange({
        username: "",
        body: ""
    });

    const [isShowingCreate, setIsShowingCreate] = useState(false);

    const { post_id } = props;

    const createComment = (e) => {
        e.preventDefault();
        console.log({ username, body, post_id });
    }

    const showCommentCreate = (val) => {
        if (val) {
            setIsShowingCreate(true);
        } else {
            setIsShowingCreate(false);
            setInput({
                username: "",
                body: ""
            });
        }
    }

    const { username, body } = input;

    const commentJSX = isShowingCreate ?
        <>
            <h3>Create Comment</h3>
            <form>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                />

                <label>Body:</label>
                <input
                    type="text"
                    name="body"
                    value={body}
                    onChange={handleInputChange}
                />
                <br />
                <input type="submit" onClick={createComment} value={"Create"} />
            </form>
            <button onClick={() => showCommentCreate(false)}>Cancel</button>
        </> :
        (<button onClick={() => showCommentCreate(true)}>Create Comment</button>)

    return (
        <>
            {commentJSX}
        </>
    )
}

export default CommentCreate;