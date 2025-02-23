import React, {useEffect, useState} from "react";
import Lottie from "lottie-react";
import './ButtonActiv.css'
import ctic from "../../config/AnimatedSticker (2).json";


const ButtonActiv = ({tip}) => {
    const [checked, setChecked] = useState(true);
    const [animationData, setAnimationData] = useState(null);
    const [previousAnimationUrl, setPreviousAnimationUrl] = useState(null);
    useEffect(() => {
        const loadAnimation = async (url) => {
            try {
                const response = await fetch(url);
                if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    setChecked(false)
                    setAnimationData(data);
                } else {
                    console.error('Получен ответ не в формате JSON');
                }
            } catch (error) {
                console.error('Ошибка при загрузке анимации:', error);
            }
        };

        const checkAnimationChange = () => {
            const currentAnimationUrl = sessionStorage.getItem('firstAnimationUrl');
            if (currentAnimationUrl && currentAnimationUrl !== previousAnimationUrl) {
                setPreviousAnimationUrl(currentAnimationUrl);
                loadAnimation(currentAnimationUrl);
            }
        };

        checkAnimationChange(); // Проверка при монтировании
        const interval = setInterval(checkAnimationChange, 1000);

        return () => clearInterval(interval);
    }, [previousAnimationUrl]);

    return (
        <div className="button_sellgift_modal">
            <div className="button_sellgift_modal_image">
                {checked ?
                    <Lottie
                        className={'button_sellgift_modal_animation_loaded'}
                        animationData={ctic}
                        loop={true}
                        autoplay={true}
                    />
                    : (animationData &&
                        <Lottie
                            className={'button_sellgift_modal_animation'}
                            animationData={animationData}
                            loop={true}
                            speed={0.5}
                        />
                    )}
            </div>
        </div>
    );
};

export default ButtonActiv;