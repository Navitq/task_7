import React from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";

function OuterMessage(props) {
    
    return (
        <Container
                    data-chat-id={props.data[4].chat_id}
                    data-message-id={props.data[4].uuid}
                    data-sender-id={props.data[0]}
                    data-user={props.data[3]}
                    key={uuidv4()}
                    className="d-flex flex-direction-column cht-area__outer-ms my-2 mt-0"
                    style={{
                        maxWidth: "70%",
                        minWidth: "20%",
                        width: "fit-content",
                    }}
                >
                    <p className="h5">{props.data[4].username}</p>
                    <p
                        style={{
                            marginBottom: "3px",
                            textAlign: "left",
                        }}
                    >
                        {props.data[2]}
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
}

export default OuterMessage;
