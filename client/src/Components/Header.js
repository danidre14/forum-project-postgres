import React, { useState, useContext } from "react";

import UserContext from "../context/userContext";

import { parseQueryObject } from "../util/utilities";

import { Link } from "react-router-dom";

import { Navbar, Nav, Container } from 'react-bootstrap';

// import SignOut from "./Authentication/SignOut";

function Header() {
    const { user, signOutUser } = useContext(UserContext);
    const [expanded, setExpanded] = useState(false);

    const onNavPressed = (e) => {
        if (
            e.target.tagName.toLowerCase() === "a" ||
            e.target.tagName.toLowerCase() === "button"
        ) setExpanded(false);
        return;
    }
    const onNavToggle = () => {
        setExpanded(expanded ? false : "expanded");
    }

    const { id: userID, username, loggedIn } = user;
    const queryObj = parseQueryObject({ id: userID, username: username });
    return (
        <header>
            <Navbar expanded={expanded} bg="info" variant="dark" expand="md" fixed="top" onClick={onNavPressed} onToggle={onNavToggle}>
                <Container>
                    <Navbar.Toggle className="mr-3" aria-controls="main-navbar-nav" />
                    <Navbar.Brand as={Link} to="/">Dani-Smorum</Navbar.Brand>
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            {loggedIn === false ?
                                <>
                                    <Nav.Link as={Link} to="/signup/">Sign Up</Nav.Link>
                                    <Nav.Link as={Link} to="/signin/">Sign In</Nav.Link>
                                </>
                                : loggedIn === true ?
                                    <>

                                        <Navbar.Text>
                                            Signed in as: {username}
                                        </Navbar.Text>
                                        <Nav.Link as={Link} to="/posts/create/">Create Post</Nav.Link>
                                        <Nav.Link as={Link} to={`/signout?${queryObj}`}>Sign Out</Nav.Link>
                                        {/* <SignOut
                                            // as={(props) => <Navbar.Text as={Link} to="/" {...props}>{props.children}</Navbar.Text>}
                                            as={Link} to="/"
                                            signOut={signOutUser} /> */}
                                    </>
                                    : <></>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}

export default Header;