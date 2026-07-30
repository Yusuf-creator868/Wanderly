import axios from "axios";

export const MAIN_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = `${MAIN_URL}/api/`;

/* -----------------------------
   MAIN API (protected requests)
------------------------------ */
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

/* -----------------------------
   LANGUAGE INTERCEPTOR
------------------------------ */

api.interceptors.request.use((config) => {

    const language = localStorage.getItem("language");

    const langMap = {
        ENG: "en",
        RUS: "ru",
        UZB: "uz",
    };

    config.params = {
        ...config.params,
        lang: langMap[language] || "en",
    };

    return config;
});

/* -----------------------------
   AUTH FUNCTIONS
------------------------------ */

export const login = async (email, password, remember_me) => {
    try {
        await api.post("token/", {
            email,
            password,
            remember_me,
        });

        return { success: true };
    } catch (err) {
        console.log(err.response?.data);

        // simplejwt's AuthenticationFailed puts the message in "detail"
        const message = err.response?.data?.detail || "Login failed. Please try again.";

        return { success: false, message };
    }
};

export const logout = async () => {
    try {
        await api.post("logout/");
        return true;
    } catch {
        return false;
    }
};

export const register = async (agency_name, username, email, password, role) => {
    const res = await api.post("register/", {
        agency_name: role === "agency" ? agency_name : undefined,
        username: role === "traveler" ? username : undefined,
        email,
        password,
        role,
    });

    return res.data;
};

export const is_authenticated = async () => {
    await api.post("authenticated/");
    return true;
};

/* -----------------------------
   REFRESH TOKEN (IMPORTANT)
------------------------------ */

export const refresh_token = async () => {
    try {
        await api.post("token/refresh/");
        return true;
    } catch {
        return false;
    }
};

/* -----------------------------
   INTERCEPTOR (FIXED)
------------------------------ */

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("token/refresh/")
        ) {
            originalRequest._retry = true;

            const refreshed = await refresh_token();

            if (refreshed) {
                return api(originalRequest);
            }

            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;