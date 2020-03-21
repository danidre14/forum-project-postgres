import React from "react";

import { Link } from "react-router-dom";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange.jsx";

function SignUp(props) {
    const [{ username, email, email2, password, password2 }, handleInputChange] = useInputChange({
        username: "",
        email: "",
        email2: "",
        password: "",
        password2: ""
    });

    const doSignUp = (e) => {
        e.preventDefault();

        console.log("tried to sign up");

        const user = { username, email, email2, password, password2 }//validatePost({ username, title, body });
        // if (!post) return setError("Invalid post");

        function postData() {
            makeRequest([`/api/v1/signup/`, "post"], user, ({ message: data }) => {
                if (data.message === "Success") {
                    console.log("Make notification", data.notif);
                    props.history.push(`/signin/`);
                    // props.history.push(`/signup/verify`);
                } else
                    alert("Failed: " + data)
            }, (message) => {
                // setError(`Cannot post blog: ${message}`);
                alert("Errorrr: " + message);
            })
        }
        postData();
    }

    return (
        <>
            <h1>Sign Up</h1>
            <form>
                <div>
                    <label htmlFor="username">Name: </label>
                    <input type="text" id="username" name="username" required
                        value={username}
                        onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" required
                        value={email}
                        onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="email2">Re-Enter Email: </label>
                    <input type="email" id="email2" name="email2" required
                        value={email2}
                        onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" required
                        value={password}
                        onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="password2">Re-Enter Password: </label>
                    <input type="password" id="password2" name="password2" required
                        value={password2}
                        onChange={handleInputChange} />
                </div>
                <button type="submit" onClick={doSignUp}>Sign Up</button>
            </form>
            <hr />
            <Link to="/signin"> Sign In</Link>
        </>
    );
}

const validateForm = ({ name, email, password }) => {
    const validTitle = Validator.isString(title) && Validator.isLength(title, { min: 1, max: 256 });
    const validBody = Validator.isString(body) && Validator.isLength(body, { min: 1, max: 2048 });
    const post = {}
    if (validTitle && validBody) {
        post.title = title;
        post.body = body;
    } else return false;
    if (username && Validator.isLength(username, { min: 1, max: 64 })) post.username = username;
    return post;
}

export default SignUp;