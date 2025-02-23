import React, {useState} from "react";
import './outputBalance.css';

import {WithdrawBalance} from '../../config/api'
import {WithdrawMin} from "../../config/config";

function OutputBalance() {
    const [value, setValue] = useState(null);
    const [method, setMethod] = useState('SBP');
    const [error, setError] = useState("");
    const [nomer, setNomer] = useState("");

    const handleMethodChange = (method) => {
        setMethod(method);
    };

    const inputButtonactiv = async () => {
        try {
            const body = {
                tg: JSON.parse(sessionStorage.getItem('user')).id || '',
                sum: value,
                type: method,
                wallet: nomer,
            }
            const response = await WithdrawBalance(body)

            if (!response.ok) {
                console.error(`Ошибка при отправке данных: ${response.status}`);
                setError(`Ошибка при отправке данных: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (data.status) {
                setError("");
            } else {
                setError(data.data.error || "Произошла ошибка");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных:", error);
            setError("Ошибка при запросе данных. Пожалуйста, попробуйте снова.");
        }
    };

    const handleNomerChange = (e) => {
        setNomer(e.target.value);
    };

    return (
        <div className="OutputBalance">
            <label id="header">Вывод средств</label>
            <div className="OutputBalance-staticButton">
                <div className="OutputBalance-invaluables">
                    <div>
                        <div className="OutputBalance-method-buttons">
                            <button
                                className={`OutputBalance-method-button ${method === 'SBP' ? 'OutputBalance-method-button-active' : ''}`}
                                onClick={() => handleMethodChange('SBP')}
                            >
                                На карту
                            </button>
                            <button
                                className={`OutputBalance-method-button ${method === 'CRYPTO_TON' ? 'OutputBalance-method-button-active' : ''}`}
                                onClick={() => handleMethodChange('CRYPTO_TON')}
                            >
                                TON
                            </button>
                        </div>
                    </div>
                    <div className="OutputBalance-invaluable">
                        <label>
                            {method === 'SBP' ? "Введите номер карты" :
                                method === 'CRYPTO_TON' ? "Введите адрес кошелька TON" : ''}
                        </label>
                        <input
                            style={{display: method === 'GIFT' ? 'none' : ''}}
                            type="text"
                            className="OutputBalance-invaluable-input"
                            value={nomer}
                            onChange={handleNomerChange}
                        />
                    </div>
                    <div className="OutputBalance-invaluable">
                        <label>Введите сумму.</label>
                        <label>Минимальная сумма {WithdrawMin} звезд</label>
                        <input
                            type="number"
                            className="OutputBalance-invaluable-input"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <button className="OutputBalance-input" onClick={inputButtonactiv}>
                Вывести
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default OutputBalance;
