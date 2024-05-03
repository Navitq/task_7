import React from "react";

function OuterCard() {
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
            <p className="h5">{props.data[0].username}</p>
            <p
                style={{
                    marginBottom: "3px",
                    textAlign: "left",
                }}
            >
                {el.message}
            </p>
            <Container className="pl-0 pr-0 d-flex justify-content-end">
                <Image src="./img/pencil.svg" roundedCircle height="19px" />
            </Container>
        </Container>
    );
}

export default OuterCard;
