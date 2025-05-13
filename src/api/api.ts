import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


export const forumApi = axios.create({
    baseURL: import.meta.env.VITE_FORUM_URL
})

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    withCredentials: true
})


forumApi.interceptors.request.use(req => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        req.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return req;
}, err => {
    return Promise.reject(err);
})


forumApi.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalReq = error.config as InternalAxiosRequestConfig & {_retry?: boolean};
    if (error.response && error.response.status === 401 && !originalReq._retry) {
        originalReq._retry = true;
        try {
            const refreshResponse = await authApi.post('/refresh');
            if (refreshResponse.status === 200 && refreshResponse.data.access_token) {
                const newAccessToken = refreshResponse.data.access_token;
                localStorage.setItem('access_token', newAccessToken);
                return forumApi(originalReq);
            } else {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});