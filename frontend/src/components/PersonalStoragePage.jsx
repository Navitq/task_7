import React from 'react'
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';



export default function StoragePageLinks(props) {

   async function logOut(){
      props.changeHeader(false)
      
      
   }

   return (
      <>
         <Nav.Item>
            <NavLink to="/admin"  className="nav-link">Chat</NavLink>
         </Nav.Item>
         <Nav.Item>
            <div style={{cursor:"pointer"}} className="nav-link" onClick={logOut}>Log Out</div>
         </Nav.Item>
      </>
   )
}
