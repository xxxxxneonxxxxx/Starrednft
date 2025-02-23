import React, { useEffect, useState } from "react";
import ctic from "../../config/AnimatedSticker.json";
import Lottie from "lottie-react";
import './orders.css';

import {CancelOffer,GetOffers} from "../../config/api";
function Orders() {
    const [ordersuser, setOrdersuser] = useState([]);
    const [animationData, setAnimationData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState(0);
    const [fixedPageCount, setFixedPageCount] = useState(0);
    const [error, setError] = useState(null);

    const itemsPerPage = 6;

    const button_Sort = (tip) => {
        setFilter(tip);
    };

    const remove = async (orderId) => {
        try {
            const body={
                tg: JSON.parse(sessionStorage.getItem('user')).id || 1801481418,
                id: orderId,
            }
            const response = await CancelOffer(body)

            if (!response.ok) {
                throw new Error(`Ошибка при удалении заказа: ${response.status}`);
            }

            const data = await response.json();
            if (data.status) {
                setOrdersuser((prevOrders) => prevOrders.filter(order => order.id !== orderId));
                setError(null);
            } else {
                throw new Error(data.data.error || "Не удалось удалить заказ.");
            }
        } catch (error) {
            setError(`Ошибка при удалении заказа: ${error.message}`);
        }
    };


    const navigator = (url) => {
        console.log(url);
        window.location.href = url;
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < fixedPageCount) setCurrentPage(currentPage + 1);
    };

    const fetchAnimation = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки анимации: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Ошибка при загрузке анимации:", error);
            setError("Не удалось загрузить анимацию. Попробуйте позже.");
            return null;
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const body={
                    tg: JSON.parse(sessionStorage.getItem('user')).id || '',
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: filter,
                }
                const response = await GetOffers(body)
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки заказов: ${response.status}`);
                }

                const data = await response.json();
                if (data.status) {
                    setOrdersuser(data.data.items);
                    setFixedPageCount(data.data.maxPage);
                    setError(null);
                } else {
                    throw new Error(data.data.error || "Не удалось загрузить заказы.");
                }
            } catch (error) {
                setError(`Ошибка при загрузке заказов: ${error.message}`);
            }
        };
        fetchOrders();
    }, [currentPage, filter]);

    useEffect(() => {
        const loadAnimations = async () => {
            const updatedData = { ...animationData };
            for (const order of ordersuser) {
                if (order.icon && !updatedData[order.icon]) {
                    const data = await fetchAnimation(order.icon);
                    if (data) {
                        updatedData[order.icon] = data;
                    }
                }
            }
            setAnimationData(updatedData);
        };

        if (ordersuser.length > 0) {
            loadAnimations();
        }
    }, [ordersuser]);

    return (
        <div className={'orders'}>
            <h1>Orders</h1>
            {error && <div className="error-message">{error}</div>}
            <div className={'orders-filters'}>
                <button
                    className={`orders-filters-button ${filter === 0 ? 'orders-filters-active' : ''}`}
                    onClick={() => button_Sort(0)}
                >
                    Все заявки
                </button>
                <button
                    className={`orders-filters-button ${filter === 1 ? 'orders-filters-active' : ''}`}
                    onClick={() => button_Sort(1)}
                >
                    В продаже
                </button>
                <button
                    className={`orders-filters-button ${filter === 2 ? 'orders-filters-active' : ''}`}
                    onClick={() => button_Sort(2)}
                >
                    Продано
                </button>
                <button
                    className={`orders-filters-button ${filter === 3 ? 'orders-filters-active' : ''}`}
                    onClick={() => button_Sort(3)}
                >
                    Отклонено
                </button>
            </div>

            <div className={'orders-main'}>
                {ordersuser.map((order, index) => (
                    <div key={index} className={'orders-information'}>
                        <button
                            onClick={() => navigator(`https://t.me/nft/${order.category.replace('-', '')}-${order.number}`)}
                            className={'orders-information-text'}
                        >
                            {animationData[order.icon] && (
                            <Lottie
                                className={'orders-information-animation'}
                                animationData={animationData[order.icon]}
                                loop={false}
                            />
                            )}
                            <label>{order.name.replace('-', ' ')} #{order.number}</label>
                        </button>
                        <div className={'orders-information-content'}>
                            <div className={'orders-information-content-status'}>
                                <label className={'orders-information-content-status-price'}>
                                    {order.price}
                                    <Lottie
                                        style={{width: '20px', height: '20px'}}
                                        animationData={ctic}
                                        loop={false}
                                    />
                                </label>
                            </div>
                            <div className={'orders-information-content-status'}>
                                <label>{order.status === "WAITING" ? 'В продаже' : order.status === 'SOLD' ? 'Продано' : 'Отклонено'}</label>
                            </div>

                        </div>

                        <button
                            className={order.status === 'WAITING' ? 'orders-information-delete' : 'orders-information-notactiv'}
                            onClick={() => remove(order.id)}
                            disabled={order.status !== 'WAITING'}
                        >
                            убрать
                        </button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {'←'}
                </button>
                <span>{currentPage} из {fixedPageCount}</span>
                <button onClick={handleNextPage} disabled={currentPage === fixedPageCount}>
                    {'→'}
                </button>
            </div>
        </div>
    );
}

export default Orders;
