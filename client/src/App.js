import React from "react";

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import PostsView from "./Components/Posts/View";
import PostsViewOne from "./Components/Posts/ViewOne";
import PostsCreate from "./Components/Posts/Create";
import Header from "./Components/Header";

function RedirectHomePage() {
    return <Redirect to='/posts/view' />
}

function App() {
    return (
        <Router>
            <Header />

            <Switch>
                <Route path="/posts/create" component={PostsCreate} />
                <Route path="/posts/view/:id" component={PostsViewOne} />
                <Route path="/posts/view" component={PostsView} />
                <Route path="/" component={RedirectHomePage} />
            </Switch>

        </Router>
    );
}

export default App;