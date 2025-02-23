import React, {useState} from "react";
import WindowShop from "./WindowShop";
import Lottie from "lottie-react";
import stic from '../../config/AnimatedSticker.json';

const WindowShopAktiv = ({onClose, variables}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState(variables);
    return (
        <div className={'WindowShopAktiv'}>
            <button className={'WindowShopAktiv-button'} onClick={() => setModalOpen(true)}>
                Купить
                <div className={'WindowShopAktiv-img'}>
                    {variables.price}
                    <Lottie
                        style={{width: '15px', height: '15px', paddingBottom: '2%'}}
                        animationData={stic}
                        loop={true}
                        autoplay={true}
                    />
                </div>
            </button>
            {isModalOpen && (
                <WindowShop
                    onClose={() => setModalOpen(false)}
                    message={message}
                />
            )}
        </div>
    );
};

export default WindowShopAktiv;
