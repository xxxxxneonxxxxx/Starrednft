import React, {useRef, useState, useEffect} from "react";
import ButtonActiv from "./ButtonActiv";
import './sellgift.css';
import Lottie from "lottie-react";
import stic from '../../config/AnimatedSticker.json';
import {useNavigate} from "react-router-dom";
import {MakeOffer, GetGiftVisualData} from "../../config/api";
import {UrlStorage, Storagefolder, OfferCost} from '../../config/config'

sessionStorage.setItem('firstAnimationUrl', '')

function Sellgift() {
    const [modelname, setModelname] = useState();
    const [modelPercent, setModelPercent] = useState();
    const [price, setPrice] = useState('');
    const [number, setNumber] = useState('');
    const [pattern, setPattern] = useState('');
    const [numberPattern, setNumberPattern] = useState('');
    const [fon, setFon] = useState('');
    const [numberFon, setNumberFon] = useState('');
    const [link, setLink] = useState('');
    const [isModalOpen, setModalOpen] = useState(true);
    const [tip, setTip] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isOfferCreated, setIsOfferCreated] = useState(false);
    const navigate = useNavigate();
    const timerRef = useRef(null);
    // Обработка ввода URL
    const handleURLPress = (e) => {
        const value = e.target.value;
        if (e.ctrlKey && e.key === 'v') {
            navigator.clipboard.readText().then((text) => {
                if (!isValidURL(text)) return;
                setLink(text);
                input_info_image(text);  // Передаем новое значение
            });
        }
        if (e.ctrlKey && e.key === 'c') {
            navigator.clipboard.writeText(value);
        }
    };

    const isValidURL = (url) => {
        const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\/\S*$/;
        return regex.test(url);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'price') setPrice(value);
    };


    const handleTextSelection = (e) => {
        const input = e.target;
        input.select();
    };

    const handleURlChange = (e) => {
        setLink(e.target.value);
        const value = e.target.value;
        if (!isValidURL(value)) return;
        setLink(value);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            input_info_image(value);
        }, 2000);
    };

    useEffect(() => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            price: price ? '' : prevErrors.price,
            link: link ? '' : prevErrors.link,
        }));
    }, [price, link]);

    const validateFields = () => {
        const newErrors = {};
        if (!link || !isValidURL(link)) newErrors.link = 'Некорректная ссылка на подарок';
        if (!price) newErrors.price = 'Цена обязана быть указана';
        return newErrors;
    };

    // Обработка данных для отправки
    const input_info_image = async (link) => {
        setApiError('');
        setSuccessMessage('');
        link = link.split('/')
        if (link.length > 4) {
            link = link[4].split('-');
        } else {
            return null
        }
        const number = link[1];
        const type = link[0];
        try {
            const body = {
                tg: JSON.parse(sessionStorage.getItem("user"))?.id || '',
                type: type,
                number: number
            };
            const response = await GetGiftVisualData(body);
            if (!response.ok) {
                throw new Error(`Ошибка при отправке данных: ${response.status}`);
            }
            const data = await response.json();
            if (data.status) {
                setTip(data.data.name.replace(' ', '-'))
                setNumber(data.data.number);
                setPattern(data.data.modelName);
                setNumberPattern(data.data.modelPercent);
                setFon(data.data.backName);
                setNumberFon(data.data.backPercent);
                setModelname(data.data.modelName)
                setModelPercent(data.data.modelPercent)
                sessionStorage.setItem('firstAnimationUrl', `https://${UrlStorage()}/${Storagefolder}/${data.data.name.replace(' ', '-')}/${data.data.modelName.replace("’", '').replace(' ', '-')}.json`)
            } else {
                throw new Error(data.data.error);
            }
        } catch (error) {
            setApiError(error.message || 'Неизвестная ошибка');
        }
    };

    const input_data = async () => {
        const validationErrors = validateFields();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        setApiError('');
        setSuccessMessage('');
        try {
            const body = {
                tg: JSON.parse(sessionStorage.getItem("user"))?.id || '',
                type: tip.replace('-', ''),
                price: price,
                number: number,
            };
            const response = await MakeOffer(body);
            if (!response.ok) {
                throw new Error(`Ошибка при отправке данных: ${response.status}`);
            }

            const data = await response.json();
            if (data.status) {
                setSuccessMessage('Ваш товар успешно выставлен!');
                setIsOfferCreated(true);
                setTimeout(() => navigate('/'), 2000);
            } else {
                setApiError(data.data.error || 'Неизвестная ошибка');
            }
        } catch (error) {
            setApiError(error.message || 'Неизвестная ошибка');
        }
    };

    const hasErrors = Object.values(errors).some((error) => error);
    const isButtonDisabled = hasErrors || isOfferCreated;

    return (
        <div className="Sellgift">
            <p id="h1_sellgift">Продажа подарка</p>
            <div className="gift-sell">
                <label style={{fontSize: '13px'}}>Вставьте сюда URL для отображения подарка</label>
                <div className={`container_object ${errors.number ? 'input-error' : ''}`}>
                    <input
                        name='link'
                        placeholder="URl: https://t.me/nft/Тип-Номер"
                        id="characteristic"
                        className="object-sellgift"
                        type="text"
                        value={link}
                        onChange={handleURlChange}
                        onKeyDown={handleURLPress}
                        onDoubleClick={handleTextSelection}
                        onMouseDown={(e) => {
                            if (e.detail === 2) handleTextSelection(e);
                        }}
                    />
                </div>
                {errors.link && <span className="error-text">{errors.link}</span>}

            </div>
            <div className="gift-sell">
                {isModalOpen && <ButtonActiv onClose={() => setModalOpen(false)} tip={tip}/>} <br/>
                <label className={'name_number'}>{(tip ? `${tip} #${number}` : '')}</label>
                <div>
                    <div className={`container_object ${errors.pattern || errors.numberPattern ? 'input-error' : ''}`}>
                        <label id="model" className="object-sellgift_1">
                            Модель: {modelname}
                        </label>
                        <label id="patern_nomer" className="object-sellgift_2">
                            {modelPercent}%
                        </label>
                    </div>
                    {errors.number && <span className="error-text">{errors.number}</span>}
                    <div className={`container_object ${errors.pattern || errors.numberPattern ? 'input-error' : ''}`}>
                        <label id="patern" className="object-sellgift_1">
                            Фон: {fon}
                        </label>
                        <label id="patern_nomer" className="object-sellgift_2">
                            {numberFon}%
                        </label>
                    </div>
                    {(errors.pattern || errors.numberPattern) &&
                        <span className="error-text">{errors.pattern || errors.numberPattern}</span>}
                    <div className={`container_object ${errors.fon || errors.numberFon ? 'input-error' : ''}`}>
                        <label id="fon" className="object-sellgift_1">
                            Узор: {pattern}</label>
                        <label id="nomerfon" className="object-sellgift_2">
                            {numberPattern}%
                        </label>
                    </div>
                    {(errors.fon || errors.numberFon) &&
                        <span className="error-text">{errors.fon || errors.numberFon}</span>}
                </div>
            </div>
            <div className={"gift-sell"}>
                <label>Цена</label>
                <div className={`sell-container ${errors.price ? 'input-error' : ''}`}>
                    <input
                        name="price"
                        id="input-sell"
                        className="input-sell"
                        type="tel"
                        value={price}
                        onChange={handleChange}
                    />
                    <Lottie animationData={stic} id="image-sell" loop={true} style={{width: '34px', height: '34px'}}/>
                </div>
                {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            <button className="sell-button" onClick={input_data} disabled={isButtonDisabled}>
                Cоздать
                <div className="sell-button-price">
                    <p>{OfferCost()}</p>
                    <Lottie animationData={stic} style={{width: '24px', height: '24px'}} loop={true}/>
                </div>
            </button>
            {apiError && <span className="error-text" id={'error-text-button'}>{apiError}</span>}
            {successMessage && <span className="success-text" id={'success-text-message'}>{successMessage}</span>}
        </div>
    );
}

export default Sellgift;
