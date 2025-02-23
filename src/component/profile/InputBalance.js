import React, {useState} from "react";
import './inputBalance.css';
import {TopUpBalance} from "../../config/api";

function InputBalance() {
    const [value, setValue] = useState(null);
    const [error, setError] = useState("");
    const [botMessage, setBotMessage] = useState(false);

    const setButton = (val) => {
        setValue(val);
        setError("");
        setBotMessage(false);
    };

    const inputButtonactiv = async () => {
        try {
            const body = {
                tg: JSON.parse(sessionStorage.getItem('user')).id || '',
                sum: value,
            };
            const response = await TopUpBalance(body);

            if (!response.ok) {
                console.error(`Ошибка при отправке данных: ${response.status}`);
                setError(`Ошибка при отправке данных: ${response.status}`);
                return;
            }

            const data = await response.json();
            if (data.status) {
                setError("");
                setBotMessage(true);
            } else {
                setError(data.data.error || "Произошла ошибка");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных:", error);
            setError("Ошибка при запросе данных. Пожалуйста, попробуйте снова.");
        }
    };

    const inputValue = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

    return (
        <div className="InputBalance">
            <p>Чтобы покупать и продавать подарки, вам нужно пополнить свой баланс. Для покупателей - чтобы покупать
                подарки. Для продавцов - для оплаты комиссии.</p>
            <div className="InputBalance-staticButton">
                {inputValue.map((item, index) => (
                    <div key={index}>
                        <button
                            onClick={() => setButton(item)}
                            className={item === value ? "active" : ""}
                        >
                            {item}
                        </button>
                    </div>
                ))}
                <input
                    className="InputBalance-invaluable"
                    onChange={(e) => setValue(Number(e.target.value))}
                    value={value}
                    type="number"
                    min="1"
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            {botMessage && (
                <p className="bot-message">
                    Чтобы продолжить пополнение, пожалуйста, перейдите в бота.
                </p>
            )}
            <button className="InputBalance-input" onClick={inputButtonactiv}>
                Пополнить
            </button>
        </div>
    );
}

export default InputBalance;
