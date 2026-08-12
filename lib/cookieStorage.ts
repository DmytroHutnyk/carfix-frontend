import {StateStorage} from "zustand/middleware";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const cookieStorage: StateStorage = {
    getItem: (name) => {
        if (typeof document === "undefined") return null;
        const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
        return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
    },
    setItem: (name, value) => {
        if (typeof document === "undefined") return;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    },
    removeItem: (name) => {
        if (typeof document === "undefined") return;
        document.cookie = `${name}=; path=/; max-age=0`;
    },
};
