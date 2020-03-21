import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";

import makeRequest from "./Components/Utils/makeRequest";

import ControlRoute from "./Components/ControlRoute.jsx";

import PostsView from "./Components/Posts/ViewPosts";
import PostsViewOne from "./Components/Posts/ViewOne";
import PostsCreate from "./Components/Posts/Create";


import SignUp from "./Components/Authentication/SignUp";
import SignIn from "./Components/Authentication/SignIn";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

function RedirectHomePage() {
    return <Redirect to='/posts/view' />
}


function checkIfLoggedIn(setUser) {
    function fetchUser() {
        makeRequest([`/api/v1/users`, "get"], {}, (data) => {
            if (data.message === "Success")
                setUser({ loggedIn: true, username: data.username, id: data.id });
        }, (message) => {
            alert("Error: Got error");
        })
    }


    fetchUser();
}

function App() {
    const [user, setUser] = useState({ loggedIn: false, username: null, id: null });
    function signOutUser() {
        setUser({ loggedIn: false, username: null, id: null });
    }

    useEffect(() => {
        checkIfLoggedIn(setUser);
    }, []);

    return (
        <Router>
            <div className="body">
                <Header signOutUser={signOutUser} user={user} />

                <main className="pt-10 pb-3 bg-ghostwhite">
                    <Container>
                        <Switch>
                            <ControlRoute key={1} path="/signup" component={SignUp} />
                            <ControlRoute key={2} path="/signin" signInUser={setUser} component={SignIn} />
                            <ControlRoute key={3} path="/posts/create" user={user} component={PostsCreate} />
                            {/* <Route path="/posts/create" render={(props) => <PostsCreate {...props} user={user} />} /> */}
                            <Route path="/posts/view/:id" render={(props) => <PostsViewOne {...props} user={user} />} />
                            <Route path="/posts/view" component={PostsView} />
                            <Route path="/" component={RedirectHomePage} />
                        </Switch>
                    </Container>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;