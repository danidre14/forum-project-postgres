import React, { useState, useContext } from "react";

import UserContext from "../context/userContext";

import { parseQueryObject } from "../util/utilities";

import { Link } from "react-router-dom";

import { Navbar, Nav, Container } from 'react-bootstrap';

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
                    <Navbar.Brand as={Link} to="/" className="mr-auto">Dani-Smorum</Navbar.Brand>
                    {loggedIn === true && <Navbar.Text className="ml-3">
                        {username}
                    </Navbar.Text>}
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="ml-auto">
                            {loggedIn === false ?
                                <>
                                    <Nav.Link as={Link} to="/signin/">Sign In</Nav.Link>
                                    <Nav.Link as={Link} to="/signup/">Sign Up</Nav.Link>
                                </>
                                : loggedIn === true ?
                                    <>
                                        <Nav.Link as={Link} to="/posts/create/">Create Post</Nav.Link>
                                        <Nav.Link as={Link} to={`/signout?${queryObj}`}>Sign Out</Nav.Link>
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