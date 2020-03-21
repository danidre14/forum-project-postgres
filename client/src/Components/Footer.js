import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav, Container } from 'react-bootstrap';

function Footer(props) {
    return (
        <footer>
            <Navbar bg="info" variant="dark">
                <Container>
                    <Navbar.Brand>&copy;2020</Navbar.Brand>
                </Container>
            </Navbar>

        </footer>
    )
}

export default Footer;