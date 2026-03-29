const setCookie = (name: string, value: string, ttl: string) => {
    const expires = "; expires=" + new Date(ttl).toUTCString();
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict; Secure`;
    document.cookie = `${name}_ttl=${ttl}${expires}; path=/; SameSite=Strict; Secure`;
};

const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const getExpiry = (name: string): string | null => {
    return getCookie(`${name}_ttl`);
};

const eraseCookie = (name: string) => {
    document.cookie = name + "=; Max-Age=-99999999; path=/;";
    document.cookie = name + "_ttl=; Max-Age=-99999999; path=/;";
};

export {setCookie, getCookie, getExpiry, eraseCookie};
