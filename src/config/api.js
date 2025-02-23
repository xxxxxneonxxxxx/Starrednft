import {Urlapi, UrlStorage, NameUrl} from "./config";

export const getAllOffers = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/getAllOffers.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(body),
    });
}

export const LoadAnimahion = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
    })
}

export const BuyItem = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/buyItem.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body)
    });
}

export const MakeOffer = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/makeOffer.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    })
}

export const GetOffers = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/user/getOffers.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    });
}

export const GetAllModels = () => {
    return `https://${UrlStorage()}/getAllModels.php`
}

export const TopUpBalance = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/user/topUpBalance.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    })
}

export const CancelOffer = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/user/cancelOffer.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    });
}

export const WithdrawBalance = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/user/withdrawBalance.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    });
}

export const GetBalance = () => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/user/getBalance.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            tg: JSON.parse(sessionStorage.getItem("user")).id || ''
        })
    });
}

export const GetGiftVisualData = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/getGiftVisualData.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    })
}

export const CheckSession = (body) => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/checkSession.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body),
    })
}
export const GetConfig = () => {
    return fetch(`https://${Urlapi()}/${NameUrl()}/getConfig.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(),
    })
}