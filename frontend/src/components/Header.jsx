import React, {  useState } from 'react'
 import { Link,NavLink } from "react-router-dom";

import Nav from 'react-bootstrap/Nav';

import AutorisationLinks from "./AutorisationLinks"
import StoragePageLinks from "./PersonalStoragePage"
import {Container, Row, Col, Image} from 'react-bootstrap';

function Header(props) {
	

	return (
		<Container >
			<header className='my-4'>
				<Row>
					<Col md="2" sm="2" xs="2" className='d-flex align-items-center d-none d-sm-flex' >
						<Link className="navbar-brand" to="https://github.com/Navitq/task_4">
							<Image src="./img/GitHub_Logo.png" height="28" className='me-3' />
							GitHub
						</Link>
					</Col>
					<Col md="10" sm="10" xs="12" className='site-hd__menu'>
						<Nav variant="pills" defaultActiveKey="/home" className='d-flex justify-content-end'>
							<Nav.Item>
								<NavLink to="/" className="nav-link">About us</NavLink>
							</Nav.Item>
							{props.headerState?null:<AutorisationLinks ></AutorisationLinks>}
							{props.headerState?<StoragePageLinks changeHeader={props.changeHeader } ></StoragePageLinks>:null}
						</Nav>
					</Col>
				</Row>
			</header>
		</Container>
	)
}

export default Header