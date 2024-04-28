import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { BrowserRouter } from "react-router-dom";

function MainPage() {
    let [headerState, setHeaderState] = useState(false);

    function changeHeader(regState) {
        setHeaderState(regState);
    }


    return (
        <Container >
            <BrowserRouter>
                <Header
                    headerState={headerState}
                    changeHeader={changeHeader}
                ></Header>
                <MainContent  headerState={headerState}  changeHeader={changeHeader}></MainContent>
                <Footer></Footer>
            </BrowserRouter>
        </Container>
    );
}

export default MainPage;
