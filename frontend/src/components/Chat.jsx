import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import io from "socket.io-client";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";

import { socket } from "./socket";
import "./css/scroll.css";
import Dialogs from "./Dialogs";
import ChatArea from "./ChatArea";
import AllCards from "./AllCards";
import DialogCard from "./DialogCard";
import OuterMessage from "./OuterMessage";
import OuterMessageFile from "./OuterMessageFile";
import InnerFileMessage from "./InnerFileMessage";
import Webrtc from "./Webrtc";

let mainUser = null;
let mainUserId = null;

function Chat() {
    let [dialogs, setDialogs] = useState("You don't have dialogs now...");
    let [contacts, setContacts] = useState("Loading...");
    let [person, setPerson] = useState("Loading...");

    useEffect(() => {
        socket.once("connect", () => {
            socket.emit("get_dialogs");
            socket.emit("get_favs");
            socket.emit("get_contacts");


            socket.on("got_favs", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                mainUser = data[0].username;
                mainUserId = data[0].user_id;
                let cards = data[1]?.map((el) => {
                    return (
                        <AllCards
                            getFile={getFile}
                            key={uuidv4()}
                            data={data}
                            mainUser={mainUser}
                            mainUserId={mainUserId}
                        ></AllCards>
                    );
                });
                let fullData = {
                    cards,
                    username: data[0].username,
                    chatId: data[2].chat_id,
                    user: mainUserId,
                    img: data[0].img,
                };
                setPerson(fullData);
                socket.emit("me");


                socket.on(mainUserId, (JSONdata) => {
                    let data = JSON.parse(JSONdata);
                    let active =
                        document.getElementById("act-chat").dataset.secondUser;
                    if (active == data[0]) {
                        let card = (
                            <OuterMessage
                                key={uuidv4()}
                                data={data}
                                mainUser={mainUser}
                                mainUserId={mainUserId}
                            ></OuterMessage>
                        );
                        setPerson((prev) => {
                            let newObj = {};

                            for (let key in prev) {
                                newObj[key] = prev[key];
                            }
                            if (newObj.cards) {
                                newObj.cards.push(card);
                            } else {
                                newObj.cards = [card];
                            }

                            return newObj;
                        });
                    }
                    socket.emit("get_dialogs");
                });

                socket.on(`${mainUserId}_file`, (JSONdata) => {
                    let data = JSON.parse(JSONdata);
                    let active =
                        document.getElementById("act-chat").dataset.secondUser;

                    if (active == data[0]) {
                        let card = (
                            <OuterMessageFile
                                key={uuidv4()}
                                data={data}
                                mainUser={mainUser}
                                mainUserId={mainUserId}
                                getFile={getFile}
                            ></OuterMessageFile>
                        );
                        setPerson((prev) => {
                            let newObj = {};

                            for (let key in prev) {
                                newObj[key] = prev[key];
                            }
                            if (newObj.cards) {
                                newObj.cards.push(card);
                            } else {
                                newObj.cards = [card];
                            }

                            return newObj;
                        });
                    }
                    socket.emit("get_dialogs");
                });
            });

            socket.on("got_dialogs", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                let cards = data.map((el) => {
                    return (
                        <DialogCard
                            el={el}
                            newContactChat={newContactChat}
                            key={uuidv4()}
                        ></DialogCard>
                    );
                });
                setDialogs(cards);
            });

            socket.on("got_contacts", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                let cards = data.map((el) => {
                    return (
                        <Card
                            key={uuidv4()}
                            className="mt-3"
                            data-phone={`${el.phone}`}
                            data-user-id={`${el.user_id}`}
                            data-uuid={`${el.user_id}`}
                            onClick={newContactChat}
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

            socket.on("got_user_data", (dataJSON) => {
                let data = JSON.parse(dataJSON);
                let cards = (
                    <AllCards
                        getFile={getFile}
                        key={uuidv4()}
                        data={data}
                        mainUser={mainUser}
                        mainUserId={mainUserId}
                    ></AllCards>
                );

                setPerson((prev) => {
                    let newObj = {
                        username: data[3].username,
                        chatId: data[2].chat_id,
                        user: mainUserId,
                        second_user: data[2].second_user,
                        img: data[3].img,
                        cards: [cards],
                    };
                    return newObj;
                });
            });

            socket.on("got_file", (file, name) => {
                let link = document.createElement("a");
                link.download = `${name}`;
                link.href = window.URL.createObjectURL(new Blob([file]));
                link.click();
                window.URL.revokeObjectURL(link.href);
            });
        });
        socket.connect();
        return () => {
            socket.close();
        };
    }, []);

    function getFile(messageId) {
        socket.emit("get_file", [messageId]);
    }

    function sendFile(file) {
        let messageId = uuidv4();
        let card = (
            <InnerFileMessage
                getFile={getFile}
                key={uuidv4()}
                messageId={messageId}
                mainUser={mainUser}
                mainUserId={mainUserId}
                file={file}
            ></InnerFileMessage>
        );
        setPerson((prev) => {
            let newObj = {};

            for (let key in prev) {
                newObj[key] = prev[key];
            }
            if (newObj.cards) {
                newObj.cards.push(card);
            } else {
                newObj.cards = [card];
            }

            return newObj;
        });
        //

        return messageId;
    }

    function newContactChat(e) {
        socket.emit(
            "get_user_data",
            JSON.stringify([mainUserId, e.currentTarget.dataset.uuid])
        );
    }

    function newMessage(message) {
        let card = (
            <Container
                key={uuidv4()}
                data-sender={mainUserId}
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

        socket.emit("get_dialogs");

        setPerson((prev) => {
            let newObj = {};

            for (let key in prev) {
                newObj[key] = prev[key];
            }
            if (newObj.cards) {
                newObj.cards.push(card);
            } else {
                newObj.cards = [card];
            }

            return newObj;
        });
        return mainUserId;
    }

    return (
        <>
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
                            sendFile={sendFile}
                            socket={socket}
                            person={person}
                            mainUserId={mainUserId}
                        ></ChatArea>
                    </Row>
                </Col>
            </Container>
            <Container>
                <Webrtc
                    socket={socket}
                    mainUserId={mainUserId}
                    mainUser={mainUser}
                ></Webrtc>
            </Container>
        </>
    );
}

export default Chat;
