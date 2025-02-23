import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import './profile.css';
import ctic from "../../config/AnimatedSticker.json";
import Lottie from "lottie-react";
import {GetBalance} from "../../config/api";

function Profile() {
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const [balance, setBalance] = useState(0);
    const navigate_order = useNavigate();
    const navigate_input = useNavigate();

    const handleNavigateOrders = () => {
        navigate_order("/profile/orders");
    };

    const handleNavigateInput = () => {
        navigate_input("/profile/input-balance");
    };

    const handleNavigateOutput = () => {
        navigate_input("/profile/output-balance");
    };

    useEffect(() => {
        const getBalance = async () => {
            try {
                const response = await GetBalance()
                const data = await response.json();
                if (data.status) {
                    setBalance(data.data.balance);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        getBalance();
        const intervalId = setInterval(getBalance, 20000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="Profile">
            <div className="Profile-user">
                <img
                    src={user.photo_url || 'https://cdn-icons-png.flaticon.com/512/126/126122.png'}
                    alt="User Avatar"
                />
                <div className="Profile-user-info">
                    <label>{user.username || "Без имени"}</label>
                    <div className="balance">
                        <p>{balance || 0}</p>
                        <Lottie
                            style={{width: '35px', height: '35px', paddingBottom: '10%'}}
                            className={'orders-information-animation'}
                            animationData={ctic}
                            loop={false}
                        />
                    </div>
                    <div className="Profile-buttonsBalance">
                        <button className="Profile-buttonsBalance-input" onClick={handleNavigateInput}>
                            Пополнить
                        </button>
                        <button className="Profile-buttonsBalance-output" onClick={handleNavigateOutput}>
                            Вывести
                        </button>
                    </div>
                </div>
            </div>

            <div className="Profile-buttonNavigate" id="my-gift">
                <div>
                    <button className="Profile-button-orders" onClick={handleNavigateOrders}>
                        <p id="my-gift-text">Ваши подарки</p>
                        <div className="line-container">
                            <div className="line_1"></div>
                            <div className="line_2"></div>
                        </div>
                    </button>
                </div>
                <div>
                    <button className="Profile-button-support">
                        <p id="support-text">Поддержка</p>
                        <div className="line-container">
                            <div className="line_1"></div>
                            <div className="line_2"></div>
                        </div>
                    </button>
                </div>
                <div>
                    <button className="Profile-button-support">
                        <p id="support-text">Исходный код</p>
                        <div className="line-container">
                            <div className="line_1"></div>
                            <div className="line_2"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
