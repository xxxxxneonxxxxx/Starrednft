import React, { useEffect, useState } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Lottie from "lottie-react";
import ctic from './config/AnimatedSticker (2).json'
import './loading.css'

import Navigate from './component/navigate/Navigate';
import Shop from "./component/shop/Shop";
import Profile from './component/profile/Profile';
import Sellgift from "./component/Sellgift/Sellgift";
import Orders from "./component/profile/Orders";
import InputBalance from "./component/profile/InputBalance";
import OutputBalance from "./component/profile/OutputBalance";
import Filter from "./component/shop/Filter";

import { GetUserDataWithAuth } from "./config/Userdata";


function AppRoutes() {
    let routes = useRoutes([
        { path: '/', element: <Shop /> },
        { path: '/nft/build', element: <Shop /> },
        { path: '/profile', element: <Profile /> },
        { path: '/Sellgift', element: <Sellgift /> },
        {path:'/profile/orders',element: <Orders />  },
        {path:'/profile/input-balance',element: <InputBalance />  },
        {path:'/profile/output-balance',element: <OutputBalance />  },
        {path: '/shop/filter', element: <Filter /> },
    ]);
    return routes;
}

function Sait() {
    const [validuser, setValiduser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user_info = await GetUserDataWithAuth();
                if (user_info) {
                    setValiduser(true);
                } else {
                    setValiduser(false);
                }
            } catch (error) {
                setValiduser(false);
                console.error("Ошибка получения данных пользователя", error);
            } finally {
                setTimeout (()=>{setLoading(false)},2000);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <Lottie
                    className={'loading-half-circle'}
                    animationData={ctic}
                    loop={true}
                    autoplay={true}
                />
            </div>
        );    }

    if (validuser) {
        return (
            <BrowserRouter>
                <div>
                    <Navigate />
                    <AppRoutes />
                </div>
            </BrowserRouter>
        );
    }
    return <h1>Ошибка входа</h1>;
}

export default Sait;
