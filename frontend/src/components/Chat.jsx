import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import io from "socket.io-client";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";

import Dialogs from "./Dialogs";
import ChatArea from "./ChatArea";
import "./css/scroll.css";

let mainUser = null;
let mainUserId = null;


function Chat() {
    let [dialogs, setDialogs] = useState("You don't have dialogs now...");
    let [contacts, setContacts] = useState("Loading...");
    let [person, setPerson] = useState("Loading...");

    let socket = useRef(io());

    useEffect(() => {
        socket.current.on("connect", () => {
            socket.current.emit("get_dialogs");
            socket.current.emit("get_favs");
            socket.current.emit("get_contacts");

            socket.current.on("got_favs", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                console.log(data);
                mainUser = data[0].username;
                mainUserId = data[0].user_id;
                let cards = data[1]?.map((el) => {
                    return (
                        <Container
                            data-chat-id = {data[2].chat_id}
                            data-message-id={el.uuid}
                            data-sender-id={el.sender_id}
                            data-user = {mainUserId}
                            key={uuidv4()}
                            className="d-flex flex-direction-column cht-area__inter-ms my-2 mt-0"
                            style={{
                                maxWidth: "70%",
                                minWidth: "20%",
                                width: "fit-content",
                            }}
                        >
                            <p className="h5">{data[0].username}</p>
                            <p
                                style={{
                                    marginBottom: "3px",
                                    textAlign: "left",
                                }}
                            >
                                {el.message}
                            </p>
                            <Container className="pl-0 pr-0 d-flex justify-content-end">
                                <Image
                                    src="./img/pencil.svg"
                                    roundedCircle
                                    height="19px"
                                />
                            </Container>
                        </Container>
                    );
                });
                let fullData = {
                    cards,
                    username: data[0].username,
                    chatId: data[2].chat_id,
                    user : mainUserId,
                    img: data[0].img,
                };
                setPerson(fullData);
            });

            socket.current.on("got_dialogs", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                let cards = data.map((el) => {
                    return (
                        <Card
                            key={uuidv4()}
                            className="mt-3"
                            data-phone={`${el.phone}`}
                            data-uuid={`${el.user_id}`}
                        >
                            <Card.Body>
                                <Card.Title className="d-flex">
                                    <Container
                                        style={{
                                            textAlign: "left",
                                            paddingLeft: "0px",
                                            paddingRight: "0px",
                                        }}
                                        className="d-flex align-items-center"
                                    >
                                        {el.username}
                                    </Container>
                                    <Container
                                        style={{
                                            width: "fit-content",
                                            paddingRight: "0px",
                                        }}
                                    >
                                        <Image
                                            src={`${el.img}`}
                                            roundedCircle
                                            height="36px"
                                        />
                                    </Container>
                                </Card.Title>
                                <Card.Text
                                    style={{
                                        maxHeight: "75px",
                                        overflow: "auto",
                                    }}
                                    className="scroll-block"
                                >
                                    {el.message ||
                                        "Find new friends! Start chatting!"}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    );
                });
                setDialogs(cards);
            });
            socket.current.on("got_contacts", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                let cards = data.map((el) => {
                    return (
                        <Card
                            key={uuidv4()}
                            className="mt-3"
                            data-phone={`${el.phone}`}
                        >
                            <Card.Body>
                                <Card.Title className="d-flex">
                                    <Container
                                        style={{
                                            textAlign: "left",
                                            paddingLeft: "0px",
                                            paddingRight: "0px",
                                        }}
                                        className="d-flex align-items-center"
                                    >
                                        {el.username}
                                    </Container>
                                    <Container
                                        style={{
                                            width: "fit-content",
                                            paddingRight: "0px",
                                        }}
                                    >
                                        <Image
                                            src={`${el.img}`}
                                            roundedCircle
                                            height="36px"
                                        />
                                    </Container>
                                </Card.Title>
                                <Card.Text
                                    style={{
                                        maxHeight: "75px",
                                        overflow: "auto",
                                    }}
                                    className="scroll-block"
                                >
                                    {el.message || "Start chatting!"}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    );
                });
                setContacts(cards);
            });
        });
    }, []);

    function newMessage(message) {
        let card = (
            <Container
                key={uuidv4()}
                data-sender = {mainUserId}
                className="d-flex flex-direction-column cht-area__inter-ms my-2 mt-0"
                style={{
                    maxWidth: "70%",
                    minWidth: "20%",
                    width: "fit-content",
                }}
            >
                <p className="h5">{mainUser}</p>
                <p style={{ marginBottom: "3px", textAlign: "left" }}>
                    {message}
                </p>
                <Container className="pl-0 pr-0 d-flex justify-content-end">
                    <Image src="./img/pencil.svg" roundedCircle height="19px" />
                </Container>
            </Container>
        );

        setPerson((prev) => {
            let newObj = {}; // новый пустой объект

            // давайте скопируем все свойства user в него
            for (let key in prev) {
                newObj[key] = prev[key];
            }
            newObj.cards.push(card);
            return newObj;
        });
        return mainUserId;
    }
    return (
        <Container
            style={{
                padding: "20px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderRadius: "15px",
                height: "100%",
            }}
        >
            <Col className="d-flex" sm="12" style={{ height: "100%" }}>
                <Row className="mr-4">
                    <Dialogs
                        dialogs={dialogs}
                        contacts={contacts}
                        style={{ flexGrow: 1 }}
                    ></Dialogs>
                </Row>
                <Row style={{ flexGrow: 1 }}>
                    <ChatArea
                        newMessage={newMessage}
                        socket={socket.current}
                        person={person}
                    ></ChatArea>
                </Row>
            </Col>
        </Container>
    );
}

export default Chat;
