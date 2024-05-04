import React, { useRef, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

function ChatArea(props) {
    let messageRef = useRef(null);
    let chatInfo = useRef(null);
    let fileRef = useRef(null);

    function addFile(){
        fileRef.current.click();
    }

    function sendMessage() {
        let senderId = props.newMessage(messageRef.current.value);

        if(fileRef.current.files[0]){
            let uuid = props.sendFile(fileRef.current.files[0]);
            props.socket.emit("send_file", [
            senderId,
            chatInfo.current.dataset.chatId,
            uuid,
            chatInfo.current.dataset.secondUser,
            fileRef.current.files[0].name
            ],
            fileRef.current.files[0]
        );
        }
        if (messageRef.current.value == "") {
            return;
        }
        props.socket.emit("send_message", [
            senderId,
            chatInfo.current.dataset.chatId,
            messageRef.current.value,
            chatInfo.current.dataset.secondUser,
        ]);
        messageRef.current.value = "";
        props.socket.emit("get_dialogs");
    }

    return (
        <Container
            className="d-flex flex-column ml-5"
            style={{ height: "100%" }}
        >
            <Container
                ref={chatInfo}
                id="act-chat"
                className="d-flex"
                data-second-user={props.person.second_user}
                data-chat-id={props.person.chatId}
                data-user={props.person.user}
            >
                <Container className="d-flex">
                    <Container
                        className="pl-0 pr-0"
                        style={{ width: "fit-content" }}
                    >
                        <Image
                            src={props.person.img}
                            height="45px"
                            roundedCircle
                        />
                    </Container>
                    <Container className="h3 d-flex align-items-center justify-content-left">
                        {props.person.username}
                    </Container>
                </Container>
                <Container
                    className="d-flex align-items-center"
                    style={{ width: "fit-content" }}
                >
                    <Image
                        src="./img/video.svg"
                        className="mx-3 ms-0"
                        style={{ marginLeft: "0px" }}
                        height="34px"
                    />
                    <Image src="./img/phone.svg" height="29px" />
                </Container>
            </Container>
            <Container
                style={{
                    flexGrow: "1",
                    flexShrink: "1",
                    flexBasis: "auto",
                    overflow: "auto",
                    marginLeft: "20px",
                }}
                className="my-4"
            >
                {props.person.cards || "Start chatting!"}
            </Container>
            <Container className="d-flex">
                <Container
                    className="d-flex"
                    style={{ flexGrow: "1", marginLeft: "20px" }}
                >
                    <Form.Control type="text" ref={messageRef} />
                </Container>
                <Container
                    className="d-flex"
                    style={{ paddingLeft: "0px", width: "fit-content" }}
                >
                    <Form.Control type="file" ref={fileRef}  style={{display:"none"}}/>
                    <Image height="34px" src="./img/clip.svg" onClick={addFile}/>
                    <Image
                        height="34px"
                        src="./img/send.svg"
                        onClick={sendMessage}
                    />
                </Container>
            </Container>
        </Container>
    );
}

export default ChatArea;
