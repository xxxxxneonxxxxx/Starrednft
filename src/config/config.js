import {GetAllModels, GetConfig} from "./api";

export let Name_sticker = [];
export let UrlStorage = () => "";
export let Storagefolder = "";
export let OfferCost = () => 1;
export let WithdrawMin = 1;
export const Urlapi = () => "-";
export const NameUrl = () => "-";

export const fetchStickers = async () => {
    try {
        const url = GetAllModels();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        Name_sticker = Object.keys(data).map(key => ({value: key}));
        return Name_sticker;
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        return [];
    }
};
export const GetConfig_1 = async () => {
    try {
        const response = await GetConfig();
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data.status) {
            Storagefolder = data.data.storageModelsFolder;
            OfferCost = () => data.data.offerCost;
            WithdrawMin = data.data.withdrawMin;
            UrlStorage = () => data.data.storageURL;
            fetchStickers()
        }
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
};
