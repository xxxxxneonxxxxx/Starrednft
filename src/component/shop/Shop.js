import React, {useEffect, useState, useCallback} from "react";
import Lottie from "lottie-react";
import './shop.css';
import Hedder from "./Hedder";
import WindowShopAktiv from "./WindowShopAktiv";
import {getAllOffers, LoadAnimahion} from '../../config/api'

function Shop() {
    const itemsPerPage = 7;
    const maxAnimations = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [labelstack, setLabelstack] = useState([]);
    const [animations, setAnimations] = useState({});
    const [activeItem, setActiveItem] = useState(null);
    const [loadingAnimationsCount, setLoadingAnimationsCount] = useState(0);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [error, setError] = useState(null);

    const closeModal = () => setActiveItem(null);

    const loadAnimationDataWithRetry = useCallback(
        async (url, index, retries = 3) => {
            if (loadingAnimationsCount >= maxAnimations) return;
            setLoadingAnimationsCount((prev) => prev + 1);
            try {
                const response = await LoadAnimahion(url)
                if (!response.ok) {
                    throw new Error(`Failed to load animation, status: ${response.status}`);
                }

                const data = await response.json();
                setAnimations((prev) => ({...prev, [index]: data}));
            } catch (error) {
                if (retries > 0) {
                    setTimeout(() => loadAnimationDataWithRetry(url, index, retries - 1), 2000);
                }
            } finally {
                setLoadingAnimationsCount((prev) => prev - 1);
            }
        },
        [loadingAnimationsCount]
    );

    const init_data = async (newPage) => {
        if (allDataLoaded) return;
        try {
            const filters = JSON.parse(sessionStorage.getItem("filters") || "{}");
            const body = {
                page: newPage,
                limit: itemsPerPage,
                upperLowerSort: filters.upperLowerSort || 0,
                priceFrom: filters.priceFrom || '',
                priceTo: filters.priceTo || '',
                rareSort: filters.rareSort || '',
                categorySort: filters.categorySort || '',
                tg: JSON.parse(sessionStorage.getItem("user"))?.id || '',
            }
            const response = await getAllOffers(body);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            if (data.status) {
                if (data.data.length === 0) {
                    setAllDataLoaded(true);
                } else {
                    setLabelstack(((prev) => {
                        const hasDuplicates = data.data.some((newItem) =>
                            prev.some((existingItem) => existingItem.id === newItem.id)
                        );
                        if (!hasDuplicates) {
                            return [...prev, ...data.data];
                        }
                        return prev;
                    }));
                    setCurrentPage(newPage);
                }
            } else {
                setError(data.data.error || "Unknown error from API.");
            }
        } catch (error) {
            setError("Failed to load data. Please try again later.");
        }
    };

    useEffect(() => {
    }, [labelstack]);
    useEffect(() => {
        init_data(currentPage);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.8 &&
                !allDataLoaded
            ) {
                init_data(currentPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, allDataLoaded]);

    useEffect(() => {
        labelstack.forEach((item, index) => {
            if (!animations[index] && loadingAnimationsCount < maxAnimations) {
                loadAnimationDataWithRetry(item.icon, index);
            }
        });
    }, [labelstack, animations, loadingAnimationsCount, loadAnimationDataWithRetry]);

    return (
        <>
            <Hedder/>
            <div className="shop">
                {error && <div className="error-message">{error}</div>}
                <div className="shop-container-stack">
                    {labelstack.map((item, index) => (
                        <div className="shop-container" id={`shop-container-${index}`} key={index}>
                            <div className="shop-up" id={`shop-up-${index}`}>
                                <label
                                    id={`tip`}>{item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1).toLowerCase()}</label>
                                <label id={`nomer`}>{`#${item.number}`}</label>
                            </div>
                            <div className="animation">
                                {animations[index] && (
                                    <Lottie
                                        animationData={animations[index]}
                                        initialSegment={[0, 1]}
                                        style={{width: '100px', height: '100px'}}
                                        loop={false}
                                        autoplay={false}
                                        onComplete={(anim) => anim.stop()}
                                    />
                                )}
                            </div>
                            <label id={`animation-name`}>{item.name.replace('-', ' ')}</label>
                            <WindowShopAktiv onClose={closeModal} variables={item}/>
                        </div>
                    ))}
                </div>
                {!error && labelstack.length === 0 && (
                    <div className="empty-message">Ничего не найдено.</div>
                )}
            </div>
        </>
    );
}

export default Shop;
