import React, { useState, useRef } from "react";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

let imgWithoutPerson = ""

export default function SignUpList(props) {
    let imgRef = useRef(null);
    let [valueEmail, setValueEmail] = useState("");
    let [valuePassWord, setValuePassWord] = useState("");
    let [valueUserName, setValueUserName] = useState("");

    async function sendRequest(e) {
        e.preventDefault();
        let formDataReg = new FormData(e.target.closest("form"));
        if (formDataReg.get("img").size > 0) {
            let reader = new FileReader();
            reader.readAsDataURL(formDataReg.get("img"));
            reader.onload = async function () {
                formDataReg.set("img", reader.result);
                let response = await fetch("/sign_up", {
                    method: "post",
                    body: formDataReg,
                });
				console.log(response)

                let message = await response.json();
				e.target.closest("form").reset()
				setValueEmail("")
				setValuePassWord("")
				setValueUserName("")
                if (message.auth == true) {
                    props.redirectFun(message.auth);
					
                }
            };
        }
    }

    return (
        <Container>
            <div
                className="h3 d-flex justify-content-center my-2 mb-3"
                style={{ textAlign: "center" }}
            >
                Register now! Trial period is completely FREE!
            </div>
            <Form
                onSubmit={(e) => {
                    sendRequest(e);
                }}
            >
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={valueUserName}
                        onChange={(e) => {
                            setValueUserName(e.target.value);
                        }}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                        type="number"
                        className="sign-up__phone"
                        placeholder="Enter phone number"
                        name="phone"
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your phone with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={valueEmail}
                        onChange={(e) => {
                            setValueEmail(e.target.value);
                        }}
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formFile" ref={imgRef} className="mb-3">
                    <Form.Label>Your avatar</Form.Label>
                    <Form.Control
                        type="file"
						required
                        name="img"
                        accept="image/png, image/jpeg"
                    />
                </Form.Group>

                <Form.Group className="mb-3"  controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={valuePassWord}
                        onChange={(e) => {
                            setValuePassWord(e.target.value);
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
