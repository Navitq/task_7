import React from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";


function DialogCard(props) {
    return (
        <Card
            key={uuidv4()}
            className="mt-3"
            data-phone={`${props.el.phone}`}
            data-uuid={`${props.el.user_id}`}
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
                        {props.el.username}
                    </Container>
                    <Container
                        style={{
                            width: "fit-content",
                            paddingRight: "0px",
                        }}
                    >
                        <Image src={`${props.el.img}`} roundedCircle height="36px" />
                    </Container>
                </Card.Title>
                <Card.Text
                    style={{
                        maxHeight: "75px",
                        overflow: "auto",
                    }}
                    className="scroll-block"
                >
                    {props.el.message || "Find new friends! Start chatting!"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default DialogCard;
