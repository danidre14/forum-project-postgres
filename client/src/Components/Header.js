import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav, Container } from 'react-bootstrap';

import SignOut from "./Authentication/SignOut";

function Header(props) {

    const { username, loggedIn } = props.user;
    return (
        <header>
            <Navbar collapseOnSelect bg="info" variant="dark" expand="md" fixed="top">
                <Container>
                    <Navbar.Toggle className="mr-3" aria-controls="main-navbar-nav" />
                    <Navbar.Brand as={Link} to="/">Dani-Smorum</Navbar.Brand>
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            {!loggedIn ?
                                <>
                                    <Nav.Link as={Link} to="/signup/">Sign Up</Nav.Link>
                                    <Nav.Link as={Link} to="/signin/">Sign In</Nav.Link>
                                </> :
                                <>

                                    <Navbar.Text>
                                        Signed in as: {username}
                                    </Navbar.Text>
                                    <Nav.Link as={Link} to="/posts/create/">Create Post</Nav.Link>
                                    <SignOut signOut={props.signOutUser} />
                                </>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}

export default Header;