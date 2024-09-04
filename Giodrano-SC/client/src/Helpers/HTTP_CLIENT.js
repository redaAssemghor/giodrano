import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.defaults.headers['giordano-api-key'] = process.env.REACT_APP_GIORDANO_API_KEY

export {axiosInstance}