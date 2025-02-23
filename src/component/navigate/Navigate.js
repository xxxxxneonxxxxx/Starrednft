import React from "react";

import Profile from "../../config/Profil.png";
import gift from "../../config/gift.png";
import Magaz from '../../config/Magazpng.png'
import './navigate.css'
import {Link} from 'react-router-dom'

function Navigate() {

    function deleteurl() {
        sessionStorage.setItem('firstAnimationUrl', '')
    }

    return (
        <nav className="Navigate">
            <Link to={'/'} className="container_navigate" id={'container_navigate_1'} onClick={() => deleteurl()}>
                <img src={Magaz}/>
                Магазин
            </Link>
            <Link to={'/Sellgift'} className="container_navigate" id={'container_navigate_4'}
                  onClick={() => deleteurl()}>
                <img src={gift}/>
                <label>Продать подарок</label>
            </Link>
            <Link to={'/profile'} className="container_navigate" id={'container_navigate_5'}
                  onClick={() => deleteurl()}>
                <img src={Profile}/>
                <label>Профиль</label>
            </Link>
        </nav>
    )
}

export default Navigate;