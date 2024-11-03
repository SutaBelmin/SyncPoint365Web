import axios from 'axios';

class BaseService {
  constructor() {

    this.api = axios.create({
      baseURL: process.env['REACT_APP_API_URL'],  
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        // const token = localStorage.getItem('token');

        // if (config.headers) {
        //     config.headers['Authorization'] = 'Bearer ' + token;
        // } else {
        //     config.headers = {
        //         Authorization: 'Bearer ' + token,
        //     };
        // }

        //return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        //handleRefreshToken
        return Promise.reject(error);
      }
    );
  }
}

export default BaseService;