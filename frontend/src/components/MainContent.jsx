import React, { Component } from 'react'
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';

import AboutUs from "./AboutUs"
import SignInList from "./SingIn"
import SignUpList from "./SingUp"
import NotFound from "./NotFound"
import Chat from "./Chat"

export default class MainContent extends Component {
	componentDidMount() {
		fetch("/sign_in")
        .then(response => response.json())
        .then((message)=>{
            if(message.auth == true){
                this.props.changeHeader(true);
            }  
        })
	}

	
	render() {
		return (
			<Container style={{flex:"1 1 auto"}} >
				<Routes >
					<Route exact path="/" element={<AboutUs></AboutUs>}></Route >
					<Route exact path="/sing_in"  element={!this.props.headerState?<SignInList redirectFun={this.props.changeHeader} />:<Navigate to="/chat" />}></Route>
					<Route exact path="/sing_up" element={!this.props.headerState?<SignUpList redirectFun={this.props.changeHeader} />:<Navigate to="/chat" />}></Route>
					<Route exact path="/chat" element={this.props.headerState?<Chat headerState={this.props.headerState}/>:<Navigate to="/sing_in" />}></Route>
					<Route path="*" element={<NotFound></NotFound>} ></Route>
				</Routes >
			</Container>
		)
	}
}
