import BaseService from './baseService';

class AuthService extends BaseService {

  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (error.response.status === 403) {
        throw new Error("Account inactive!")
      } 
      else {
        throw new Error('An error occurred, please try again later');
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
}

const authService =  new AuthService();
export default authService;