import React from "react";
import {useNavigate} from "react-router-dom";
import "./hedder.css";
import logo from '../../config/Picsart_25-01-22_23-41-43-770.png'

function Hedder() {
    const navigating=useNavigate();
    const cluck_mune=()=>{
        navigating('/shop/filter')
    }
    return (
        <header className="hedder" id={"hedder_sait"}>
            <h1>StarredNFT</h1>
            <button className={'hedder-filter'} onClick={cluck_mune}>
                <img src={logo} alt="logo"/>
                Фильтр
            </button>
        </header>
    );
}

export default Hedder;