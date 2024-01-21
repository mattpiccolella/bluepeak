import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const fetchNoAuth = async(url, options = {}) => {
    return axios({
        ...options,
        url: `${serverUrl}${url}`
    });
}

export const fetchWithAuth = async (url, token, options = {}) => {
    return axios({
        ...options,
        url: `${serverUrl}${url}`,
        headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
        }
    });
};