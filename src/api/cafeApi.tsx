import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settings from "../theme/settings";

const baseURL = settings.baseURL;
//const baseURL = 'https://supervision-tecnica.com/node';

const cafeApi = axios.create({ baseURL });

cafeApi.interceptors.request.use(
    async(config: any) => {
        const token = await AsyncStorage.getItem('token');   
        if (token) {
            config.headers['Authorization'] = token;
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    }
);

export default cafeApi;
