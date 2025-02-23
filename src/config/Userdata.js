import {CheckSession} from "./api";
import {GetConfig_1} from "./config";

export const GetUserDataWithAuth = async () => {
    try {
        GetConfig_1()

        if (window.Telegram && window.Telegram.WebApp) {
            const webApp = window.Telegram.WebApp;
            const initData = window.Telegram.WebApp.initData;
            const user = webApp.initDataUnsafe?.user || {};
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("datauser", initData);
            try {
                const body = {
                    initData: initData,
                    tg: JSON.parse(sessionStorage.getItem("user"))?.id || ''
                }
                const response = await CheckSession(body);
                if (!response.ok) {
                }
                const data = await response.json();
                return data.status;

            } catch (error) {
                return {error: 'Error fetching user data from the server'};
            }
        } else {
            throw new Error("Telegram WebApp API is not loaded properly.");
        }
    } catch (error) {
        console.error('Error in GetUserData:', error);
        return {error: 'Telegram WebApp API not loaded properly'};
    }
};
