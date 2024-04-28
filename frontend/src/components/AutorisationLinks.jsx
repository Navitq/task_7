import React from 'react'
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';

function AutorisationLinks(props) {


	return (
		<>
		    <Nav.Item>
				<NavLink to="/sing_in" className="nav-link"  end>Sign In</NavLink>
			</Nav.Item>
			<Nav.Item>
				<NavLink to="/sing_up" className="nav-link" end>Sign Up</NavLink>
			</Nav.Item>
		</>
	)
}

export default AutorisationLinks