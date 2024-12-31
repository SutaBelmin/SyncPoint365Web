import BaseService from './baseService';

class AuthService extends BaseService {

  async login(email, password) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
}

}

const authService =  new AuthService();
export default authService;
