import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <Link to="/"><h1>Dani-Smorum</h1></Link>
            <Link to="/posts/create/">Create Post</Link>
        </header>
    )
}

export default Header;