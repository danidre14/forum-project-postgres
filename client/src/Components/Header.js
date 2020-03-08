import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav, Container } from 'react-bootstrap';

function Header() {
    return (
        <header>
            <Navbar collapseOnSelect bg="info" variant="dark" expand="lg" fixed="top">
                <Container>
                    <Navbar.Toggle className="mr-3" aria-controls="main-navbar-nav" />
                    <Navbar.Brand as={Link} to="/">Dani-Smorum</Navbar.Brand>
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/posts/create/">Create Post</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}

export default Header;