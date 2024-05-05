import React, { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { socket } from "./socket";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Image } from "react-bootstrap";

function Webrtc(props) {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
            .then((streamCurrent) => {
                console.log(1111111111111, streamCurrent)
                setStream(streamCurrent);
            //if(streamCurrent)
               //     myVideo.current.srcObject = streamCurrent;
            });

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("call_user", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
        });
    }, []);

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", (data) => {
            socket.emit("call_user", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
            });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });
        socket.on("call_accepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", (data) => {
            socket.emit("answer_call", { signal: data, to: caller });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
    };

    return (
        <>
            <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream || (
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                style={{ width: "300px" }}
                            />
                        )}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ? (
                            <video
                                playsInline
                                ref={userVideo}
                                autoPlay
                                style={{ width: "300px" }}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="myId">
                    <Form.Control
                        as="textarea"
                        rows={1}
                        id="filled-basic"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            Copy ID
                        </Button>
                    </CopyToClipboard>

                    <Form.Control
                        as="textarea"
                        rows={1}
                        id="filled-basic"
                        label="ID to call"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />

                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={leaveCall}
                            >
                                End Call
                            </Button>
                        ) : (
                            <Image
                                color="primary"
                                aria-label="call"
                                onClick={() => callUser(idToCall)}
                                src="./img/phone.svg"
                            ></Image>
                        )}
                        {idToCall}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1>{name} is calling...</h1>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={answerCall}
                            >
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default Webrtc;
