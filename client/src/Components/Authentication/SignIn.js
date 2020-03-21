import React from "react";

import { Link } from "react-router-dom";
import makeRequest from "../Utils/makeRequest";
import useInputChange from "../Utils/useInputChange.jsx";

function SignIn(props) {
    const [{ usernameOrEmail, password }, handleInputChange] = useInputChange({
        usernameOrEmail: "",
        password: "",
    });

    const doSignIn = (e) => {
        e.preventDefault();


        // return;
        const post = { usernameOrEmail, password }//validatePost({ username, title, body });
        // if (!post) return setError("Invalid post");

        function postData() {
            makeRequest([`/api/v1/signin/`, "post"], post, ({ message: data }) => {
                if (data.message === "Success") {
                    props.signInUser({ loggedIn: true, username: data.username, id: data.id });
                    props.history.push(`/`);
                } else
                    alert("Failed SignIn: " + data);
            }, (message) => {
                // setError(`Cannot post blog: ${message}`);
                alert("Error: " + message);
            })
        }
        postData();
    }

    return (
        <>
            <h1>Sign In</h1>
            <form>
                <div>
                    <label htmlFor="usernameOrEmail">Username: </label>
                    <input type="email" id="usernameOrEmail" name="usernameOrEmail" required
                        value={usernameOrEmail}
                        onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" required
                        value={password}
                        onChange={handleInputChange} />
                </div>
                <button type="submit" onClick={doSignIn}>Sign In</button>
            </form>
            <hr />
            <Link to="/signup"> Sign Up</Link>
        </>
    );
}

export default SignIn;