import React, { Component } from "react";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./css/main.css";

export class SignInList extends Component {
    constructor(props) {
        super(props);
        this.state = { valueEmail: "", valuePassWord: "" };

        this.setValueEmail = this.setValueEmail.bind(this);
        this.setValuePassWord = this.setValuePassWord.bind(this);

        this.sendRequest = this.sendRequest.bind(this);
    }

    async sendRequest(e) {
        e.preventDefault();
        let response = await fetch("/sign_in", {
            method: "post",
            body: new FormData(e.currentTarget)
        })
        if(response.status == 401){
            this.props.redirectFun(false);
            return
        }
        let message = await response.json();

        if(message.auth == true){
            this.props.redirectFun(true);
        }    
    }

    setValueEmail(event) {
        this.setState({ valueEmail: event.target.value });
    }

    setValuePassWord(event) {
        this.setState({ valuePassWord: event.target.value });
    }

    render() {
        return (
            <Container>
                <div
                    className="h3 d-flex justify-content-center my-2 mb-3"
                    style={{ textAlign: "center" }}
                >
                    Glad to see you again! Log in!
                </div>
                <Form
                    onSubmit={(e) => {
                        this.sendRequest(e);
                    }}
                >
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control
                            className="sign-in__phone"
                            type="number"
                            placeholder="+375274562354"
                            name="phone"
                            value={this.valueEmail}
                            onChange={(e) => {
                                this.setValueEmail(e);
                            }}
                            required
                        />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={this.valuePassWord}
                            onChange={(e) => {
                                this.setValuePassWord(e);
                            }}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default SignInList;
