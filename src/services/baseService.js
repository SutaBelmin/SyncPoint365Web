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
      async (error) => {
        if(error.response && error.response.status === 401){
          await this.refreshToken();
          return this.api(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken){
      try {
        const response = await this.api.post('/refresh/generate', {refreshToken});
        const {token, refreshToken: newRefreshToken} = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
      } catch (error) {
        console.error('Refresh token failed!', error);
      }
    } else {
      console.error('No refresh token available!');
    }
  }
}

export default BaseService;
