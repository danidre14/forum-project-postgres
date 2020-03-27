import React, { useState } from "react";

import UserContext from "./context/userContext";

import Router from "./MyBrowserRouter";

import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";

import ControlRoute from "./Components/ControlRoute";
import MiddleWare from "./Components/MiddleWare";

import PostsView from "./Components/Posts/ViewPosts";
import PostsViewOne from "./Components/Posts/ViewOne";
import PostsCreate from "./Components/Posts/Create";
import PostsEdit from "./Components/Posts/EditPost";


import SignUp from "./Components/Authentication/SignUp";
import SignUpVerify from "./Components/Authentication/SignUpVerify";
import SignIn from "./Components/Authentication/SignIn";
import SignOut from "./Components/Authentication/SignOut";

import TryCatch from "./Components/Utils/TryCatch";
import Header from "./Components/Header";
import notificationBox from "./Components/Utils/notificationBox";
import Footer from "./Components/Footer";

function RedirectHomePage() {
    return <Redirect to='/posts/view' />
}

function App() {
    const [user, setUser] = useState({ loggedIn: null, username: null, id: null });

    const [NotifBox, setNotifValue] = notificationBox(false);

    function signOutUser() {
        setUser({ loggedIn: false, username: null, id: null });
    }
    function signInUser({ username, id }) {
        setUser({ loggedIn: true, username, id });
    }

    return (
        <Router>
            <div className="body">
                <UserContext.Provider value={{ user, signInUser, signOutUser, setNotifValue }}>
                    <TryCatch>
                        <Header />
                    </TryCatch>

                    <TryCatch>
                        <main className="pt-10 pb-3 bg-ghostwhite">
                            <Container>
                                <TryCatch>
                                    <NotifBox />
                                </TryCatch>
                                <Route component={MiddleWare} />
                                <Switch>
                                    <ControlRoute key={1} path="/signup/verify" component={SignUpVerify} />
                                    <Route key={2} path="/signout" component={SignOut} />
                                    <ControlRoute key={3} path="/signup" component={SignUp} />
                                    <ControlRoute key={4} path="/signin" component={SignIn} />
                                    <ControlRoute key={5} path="/posts/create" component={PostsCreate} />
                                    <ControlRoute key={6} path="/posts/edit/:id" component={PostsEdit} />
                                    <Route path="/posts/view/:id" component={PostsViewOne} />
                                    <Route path="/posts/view" component={PostsView} />
                                    <Route path="/" component={RedirectHomePage} />
                                </Switch>
                            </Container>
                        </main>
                    </TryCatch>
                    <TryCatch>
                        <Footer />
                    </TryCatch>
                </UserContext.Provider>
            </div>
        </Router>
    );
}

export default App;