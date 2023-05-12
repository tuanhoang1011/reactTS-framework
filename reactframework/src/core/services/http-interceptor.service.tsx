import axios from 'axios';

const HTTPInterceptor = ({ children }) => {
    try {
        axios.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                return response && response.data;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return children;
    } catch (error) {
        throw error;
    }
};

export default HTTPInterceptor;
