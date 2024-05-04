import React from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";

function OuterMessageFile(props) {
    function getFile(e) {
        props.getFile(
            e.currentTarget.closest(".flex-direction-column").dataset.messageId
        );
    }
    return (
        <Container
            data-message-id={props.data[2]}
            key={uuidv4()}
            data-sender={props.mainUserId}
            className="d-flex flex-direction-column cht-area__outer-ms my-2 mt-0"
            style={{
                maxWidth: "70%",
                minWidth: "20%",
                width: "fit-content",
            }}
        >
            <p className="h5">{props.mainUser}</p>
            <Container
                onClick={getFile}
                style={{
                    marginBottom: "3px",
                    textAlign: "left",
                    display: "flex",
                    marginBottom: "0px",
                }}
            >
                <Image src="./img/file.svg" height="25px"></Image>
                <p style={{ marginBottom: "0px" }}>{props.data[4]}</p>
            </Container>
            <Container className="pl-0 pr-0 d-flex justify-content-end">
                <Image src="./img/pencil.svg" roundedCircle height="19px" />
            </Container>
        </Container>
    );
}

export default OuterMessageFile;
