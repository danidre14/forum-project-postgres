import React, { useState, useEffect } from "react";

import UserContext from "./context/userContext";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";

import makeRequest from "./Components/Utils/makeRequest";

import ControlRoute from "./Components/ControlRoute.jsx";

import PostsView from "./Components/Posts/ViewPosts";
import PostsViewOne from "./Components/Posts/ViewOne";
import PostsCreate from "./Components/Posts/Create";


import SignUp from "./Components/Authentication/SignUp";
import SignUpVerify from "./Components/Authentication/SignUpVerify";
import SignIn from "./Components/Authentication/SignIn";
import SignOut from "./Components/Authentication/SignOut";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

function RedirectHomePage() {
    return <Redirect to='/posts/view' />
}


function checkIfLoggedIn(signInUser, signOutUser) {
    function fetchUser() {
        makeRequest([`/api/v1/users`, "get"], {}, (data) => {
            if (data.message === "Success") {
                const user = { username: data.username, id: data.id };
                signInUser(user);
            } else signOutUser();
        }, (message) => {
            console.log("Error: Got error trying to check if signed in");
        })
    }


    fetchUser();
}

function App() {
    const [user, setUser] = useState({ loggedIn: null, username: null, id: null });
    function signOutUser() {
        setUser({ loggedIn: false, username: null, id: null });
    }
    function signInUser({ username, id }) {
        setUser({ loggedIn: true, username, id });
    }

    useEffect(() => {
        checkIfLoggedIn(signInUser, signOutUser);
    }, []);

    return (
        <Router>
            <div className="body">
                <UserContext.Provider value={{ user, signInUser, signOutUser }}>
                    <Header />

                    <main className="pt-10 pb-3 bg-ghostwhite">
                        <Container>
                            <Switch>
                                <ControlRoute key={1} path="/signup/verify" component={SignUpVerify} />
                                <Route key={2} path="/signout" component={SignOut} />
                                <ControlRoute key={3} path="/signup" component={SignUp} />
                                <ControlRoute key={4} path="/signin" component={SignIn} />
                                <ControlRoute key={5} path="/posts/create" component={PostsCreate} />
                                {/* <Route path="/posts/create" render={(props) => <PostsCreate {...props} user={user} />} /> */}
                                {/* <Route path="/posts/view/:id" render={(props) => <PostsViewOne {...props} user={user} />} /> */}
                                <Route path="/posts/view/:id" component={PostsViewOne} />
                                <Route path="/posts/view" component={PostsView} />
                                <Route path="/" component={RedirectHomePage} />
                            </Switch>
                        </Container>
                    </main>
                </UserContext.Provider>
                <Footer />
            </div>
        </Router>
    );
}

export default App;