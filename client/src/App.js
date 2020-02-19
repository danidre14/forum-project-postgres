import React from "react";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import PostsView from "./Components/Posts/View";
import PostsViewOne from "./Components/Posts/ViewOne";
import PostsCreate from "./Components/Posts/Create";
import Header from "./Components/Header";

function App() {
    return (
        <Router>
            <Header />

            <Switch>
                <Route path="/posts/create" component={PostsCreate} />
                <Route path="/posts/view/:id" component={PostsViewOne} />
                <Route path="/posts/view" component={PostsView} />
                <Route path="/" component={PostsView} />
            </Switch>
        </Router>
    );
}

export default App;