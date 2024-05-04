import React from "react";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";


function InnerFileMessage(props) {

    function getFile(e){
        props.getFile( e.currentTarget.closest(".flex-direction-column").dataset.messageId)
    }

    return (
        <Container
            data-message-id={props.messageId}
            key={uuidv4()}
            data-sender={props.mainUserId}
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
                    marginBottom: "0px"
                }}
                onClick={getFile}
            >
                <Image src="./img/file.svg" height="25px"></Image>
                <p  style={{marginBottom: "0px"}}>{props.file.name}</p>
            </Container>
            <Container className="pl-0 pr-0 d-flex justify-content-end">
                <Image src="./img/pencil.svg" roundedCircle height="19px" />
            </Container>
        </Container>
    );
}

export default InnerFileMessage;
