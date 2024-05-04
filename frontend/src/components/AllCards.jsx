import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";

function AllCards(props) {

    function getFile(e) {
        props.getFile(
            e.currentTarget.closest(".flex-direction-column").dataset.messageId
        );
    }
    console.log(props.data,11111111);
    let cards = props.data[1].map((el) => {
        console.log(typeof el.file_id, el.file_id, !el.file_id);
        if (el.sender_id == props.mainUserId && !el.file_id) {
            return (
                <Container
                    data-chat-id={props.data[2].chat_id}
                    data-message-id={el.uuid}
                    data-sender-id={el.sender_id}
                    data-user={props.mainUserId}
                    key={uuidv4()}
                    className="d-flex flex-direction-column cht-area__inter-ms my-2 mt-0"
                    style={{
                        maxWidth: "70%",
                        minWidth: "20%",
                        width: "fit-content",
                    }}
                >
                    <p className="h5">{props.mainUser}</p>
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
        } else if (!el.file_id) {
            return (
                <Container
                    data-chat-id={props.data[2].chat_id}
                    data-message-id={el.uuid}
                    data-sender-id={el.sender_id}
                    data-user={props.mainUserId}
                    key={uuidv4()}
                    className="d-flex flex-direction-column cht-area__outer-ms my-2 mt-0"
                    style={{
                        maxWidth: "70%",
                        minWidth: "20%",
                        width: "fit-content",
                    }}
                >
                    <p className="h5">{props.data[3].username}</p>
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
        } else if (el.sender_id == props.mainUserId) {
            return (
                <Container
                    data-chat-id={props.data[2].chat_id}
                    data-message-id={el.file_id}
                    data-sender-id={el.sender_id}
                    data-user={props.mainUserId}
                    key={uuidv4()}
                    className="d-flex flex-direction-column cht-area__inter-ms my-2 mt-0"
                    style={{
                        maxWidth: "70%",
                        minWidth: "20%",
                        width: "fit-content",
                    }}
                >
                    <p className="h5">{props.mainUser}</p>
                    <Container
                        style={{
                            marginBottom: "3px",
                            textAlign: "left",
                            display: "flex",
                            marginBottom: "0px",
                        }}
                        onClick={getFile}
                    >
                        <Image src="./img/file.svg" height="25px"></Image>
                        <p style={{ marginBottom: "0px" }}>{el.file_name}</p>
                    </Container>
                    <Container className="pl-0 pr-0 d-flex justify-content-end">
                        <Image
                            src="./img/pencil.svg"
                            roundedCircle
                            height="19px"
                        />
                    </Container>
                </Container>
            );
        } else {
            return (
                <Container
                    data-chat-id={props.data[2].chat_id}
                    data-message-id={el.file_id}
                    data-sender-id={el.sender_id}
                    data-user={props.mainUserId}
                    key={uuidv4()}
                    className="d-flex flex-direction-column cht-area__outer-ms my-2 mt-0"
                    style={{
                        maxWidth: "70%",
                        minWidth: "20%",
                        width: "fit-content",
                    }}
                >
                    <p className="h5">{props.data[3].username}</p>
                    <Container
                        style={{
                            marginBottom: "3px",
                            textAlign: "left",
                            display: "flex",
                            marginBottom: "0px",
                        }}
                        onClick={getFile}

                    >
                        <Image src="./img/file.svg" height="25px"></Image>
                        <p style={{ marginBottom: "0px" }}>{el.file_name}</p>
                    </Container>
                    <Container className="pl-0 pr-0 d-flex justify-content-end">
                        <Image
                            src="./img/pencil.svg"
                            roundedCircle
                            height="19px"
                        />
                    </Container>
                </Container>
            );
        }
    });

    return cards;
}

export default AllCards;
