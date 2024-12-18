import BaseService from './baseService';

class AuthService extends BaseService {

  async login(email, password) {
      const response = await this.api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      return { user, token };
  }

  logout() {
    localStorage.removeItem('token');
  }
}

const authService =  new AuthService();
export default authService;