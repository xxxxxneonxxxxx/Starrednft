import React, {useEffect} from "react";
import './filter.css';
import {Name_sticker} from "../../config/config"
import {useNavigate} from "react-router-dom";

function Filter() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [minPrice, setMinPrice] = React.useState('');
    const [maxPrice, setMaxPrice] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState("");
    const [selectedRarity, setSelectedRarity] = React.useState('');
    const [selectedSticker, setSelectedSticker] = React.useState('');

    const rarity = [
        '',
        'Common',
        'Rare',
        'Epic',
        'Legendary'
    ];

    const nameSticker = Name_sticker;
    const navigate = useNavigate();

    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
    const handleSortOrderChange = (e) => setSortOrder(e.target.value);
    const handleRarityChange = (item, index) => {
        setSelectedRarity(item);
        if (activeIndex === index) return;
        setActiveIndex(index)
    };
    const handleStickerChange = (e) => setSelectedSticker(e.target.value);

    const buttonNavigate = () => {
        navigate('/');
    };

    useEffect(() => {
        const filters = () => {
            const data = {
                priceFrom: minPrice,
                priceTo: maxPrice,
                upperLowerSort: sortOrder,
                rareSort: selectedRarity.toUpperCase(),
                categorySort: selectedSticker,
            };
            sessionStorage.setItem('filters', JSON.stringify(data));
        };
        filters();
    }, [minPrice, maxPrice, sortOrder, selectedRarity, selectedSticker]);

    return (
        <div className="filter">
            <h1>Фильтр</h1>
            <div className="filter-buttons">
                <div className="filter-button-tip">
                    <select value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="1">От низкой до высокой</option>
                        <option value="2">От высокой до низкой</option>
                    </select>
                </div>
                <div className="filter-button-number">
                    <label>
                        От:
                        <input
                            placeholder="0.00"
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                        />
                    </label>
                    <label>
                        До:
                        <input
                            placeholder="0.00"
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                        />
                    </label>
                </div>
                <div className="filter-button-rarity">
                    <div>
                        {rarity.map((item, index) => (
                            <button className={(activeIndex === index ? 'activbutton-filter' : '')}
                                    style={{display: (item === '' ? 'none' : '')}} key={index}
                                    onClick={() => handleRarityChange(item, index)}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-button-sticker">
                    <select value={selectedSticker} onChange={handleStickerChange}>
                        <option value="">Все элементы</option>
                        {nameSticker.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.value.replace(' ', '-')}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="filter-button-activ"
                    onClick={buttonNavigate}
                >
                    Выбрать
                </button>
            </div>
        </div>
    );
}

export default Filter;
