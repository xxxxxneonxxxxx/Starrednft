import React, {useCallback, useState, useEffect} from 'react';
import './WindowShop.css';
import Lottie from "lottie-react";
import {Link, Navigate, useNavigate} from "react-router-dom";

import {LoadAnimahion, BuyItem} from "../../config/api";
import stic from "../../config/AnimatedSticker.json";

const WindowShop = ({onClose, message}) => {
    console.table(message);
    const navigate = useNavigate();
    const [animationData, setAnimationData] = useState(null);
    const [error, setError] = useState(null);
    const [purchaseMessage, setPurchaseMessage] = useState("");
    const loadAnimationDataWithRetry = useCallback(async (url, retries = 3) => {
        try {
            const response = await LoadAnimahion(url)

            if (!response.ok) {
                throw new Error(`Failed to load animation, status: ${response.status}`);
            }

            const data = await response.json();
            setAnimationData(data);
        } catch (error) {
            setError("Не удалось загрузить анимацию. Попробуйте позже.");
            if (retries > 0) {
                setTimeout(() => loadAnimationDataWithRetry(url, retries - 1), 2000);
            }
        }
    }, []);

    useEffect(() => {
        if (message.icon) {
            loadAnimationDataWithRetry(message.icon);
        }
    }, [message.icon, loadAnimationDataWithRetry]);

    const importInfo = async (id) => {
        try {
            const body = {
                tg: JSON.parse(sessionStorage.getItem('user'))?.id || '',
                id: id,
            }
            const response = await BuyItem(body);

            const data = await response.json();
            if (data.status) {
                setPurchaseMessage("Вы успешно купили подарок!");
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(data.data?.error || "Не удалось выполнить покупку.");
            }
        } catch {
            setError("Произошла ошибка при выполнении запроса.");
        }
    };

    return (
        <div className="modal-shop">
            <div className="modal-content_shop">
                <div className="modal-content_shop_image_name">
                    <button className="button-modal_content_shop_close" onClick={onClose}>
                        <img src="https://img.icons8.com/ios11/512/FFFFFF/delete-sign.png" alt="Close"/>
                    </button>
                    {animationData ? (
                        <Lottie id="modal-content_shop_img"
                                animationData={animationData}/>
                    ) : (
                        <p>Загрузка анимации...</p>
                    )}
                    <a href={`https://t.me/nft/${message.category.replace('-', '')}-${message.number}`}>
                        <label id="modal-content_shop_name">
                            {(message.category ? `${message.category.replace('-', ' ')} #${message.number}` : '')}
                        </label></a>
                    {error && <div className="error-message">{error}</div>}
                    {purchaseMessage && <div className="purchase-message">{purchaseMessage}</div>}
                </div>
                <div className="modal-content_shop_info">
                    <div className="modal-content_shop_info_content">
                        <p id="modal-content_shop_info_model">Модель: {message.name.replace('-', ' ')}</p>
                        <p id="modal-content_shop_info_yzor">{message.nameNumber}%</p>
                    </div>
                    <div className="modal-content_shop_info_content">
                        <p id="modal-content_shop_info_yzor">Узор: {message.patternName}</p>
                        <p id="modal-content_shop_info_yzor">{message.patternNumber}%</p>
                    </div>
                    <div className="modal-content_shop_info_content">
                        <p id="modal-content_shop_info_fon">Фон: {message.backName}</p>
                        <p id="modal-content_shop_info_fon">{message.backNumber}%</p>
                    </div>
                    <div className="modal-content_shop_info_content">
                        <p id="modal-content_shop_info_red">Редкость</p>
                        <p id="modal-content_shop_info_red">{message.rarity.charAt(0).toUpperCase() + message.rarity.slice(1).toLowerCase()}</p>
                    </div>
                </div>
                <button className="modal-content_shop_button" onClick={() => importInfo(message.id)}>
                    Купить
                    <div className={'WindowShopAktiv-img'}>
                        {message.price}
                        <Lottie
                            style={{width: '30px', height: '30px', paddingBottom: '2%'}}
                            animationData={stic}
                            loop={true}
                            autoplay={true}
                        />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default WindowShop;
