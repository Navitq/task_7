import React, { Component } from 'react'
import { Container, Image } from 'react-bootstrap';


export default class NotFound extends Component {
   render() {
      return (
         <Container>
            <div className="h1 d-flex justify-content-center my-5 mb-3 text-warning" style={{textAlign:"center"}}>
               Page wasn't found 404
            </div>
            <div className='d-flex justify-content-center my-5 mb-0'>
               <Image src="./img/ghost.jpg" height="250"/>
            </div>
         </Container>
      )
   }
}
