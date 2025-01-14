import axios from 'axios';

class BaseService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env['REACT_APP_API_URL'],  
      headers: {
        'Content-Type': 'application/json'
      },
    });

    this.api.interceptors.request.use(
      (config) => { 
        const token = localStorage.getItem('token') || '';
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default BaseService;
