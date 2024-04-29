import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";

function Dialogs(props) {
    return (
        <Container style={{ maxWidth: "323px" }}>
            <Tabs
                defaultActiveKey="home"
                className="mb-3"
            >
                <Tab eventKey="home" title="Chats">
                    <Container className="d-flex flex-column">
                        <Container>
                            <Form.Control
                                type="text"
                                placeholder="Search chat..."
                            />
                        </Container>
                        <Container>{props.dialogs}</Container>
                    </Container>
                </Tab>
                <Tab eventKey="profile" title="Search">
                    <Container className="d-flex flex-column">
                        <Container>
                            <Form.Control
                                type="text"
                                placeholder="Search friends..."
                            />
                        </Container>
                        <Container>{props.contacts}</Container>
                    </Container>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default Dialogs;
