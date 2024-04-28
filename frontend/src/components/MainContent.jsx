import React, { Component } from 'react'
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import io from "socket.io-client";

import AboutUs from "./AboutUs"
import SignInList from "./SingIn"
import SignUpList from "./SingUp"
import NotFound from "./NotFound"
import Chat from "./Chat"

const socket = io();

export default class MainContent extends Component {
	componentDidMount() {
		fetch("/sign_in")
        .then(response => response.json())
        .then((message)=>{
			console.log(message)
            if(message.auth == true){
                console.log(2222222222222222222)
                this.props.changeHeader(true);
            }  
        })
	}

	
	render() {
		return (
			<Container style={{flex:"1 1 auto"}} >
				<Routes >
					<Route exact path="/" element={<AboutUs></AboutUs>}></Route >
					<Route exact path="/sing_in"  element={!this.props.headerState?<SignInList socket={socket} redirectFun={this.props.changeHeader} />:<Navigate to="/chat" />}></Route>
					<Route exact path="/sing_up" element={!this.props.headerState?<SignUpList socket={socket} redirectFun={this.props.changeHeader} />:<Navigate to="/chat" />}></Route>
					<Route exact path="/chat" element={this.props.headerState?<Chat  socket={socket}/>:<Navigate to="/sing_in" />}></Route>
					<Route path="*" element={<NotFound></NotFound>} ></Route>
				</Routes >
			</Container>
		)
	}
}
