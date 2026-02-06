import axios from 'axios'
import { getEnvVariables } from '../helpers/getEnvVariables'

const {VITE_API_URL} = getEnvVariables()

const formApi = axios.create({
    baseURL: VITE_API_URL
})

// TODO: configurar interceptores
formApi.interceptors.request.use(config => {
    
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }
    console.log(config.headers);
    
    return config
});

export default formApi;