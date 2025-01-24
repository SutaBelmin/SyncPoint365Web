export class AuthStore {
  constructor() {
    this.initialize();
  }

  setUser(user, accessToken, refreshToken) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.loggedUser = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  removeUser() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken')
    this.loggedUser = null;
    this.accessToken = null;
    this.refreshToken = null;
  }

  getUser() {
    return this.loggedUser;
  }

  initialize() {
    const loggedUser = localStorage.getItem('loggedUser');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    this.loggedUser = loggedUser ? JSON.parse(loggedUser) : null;
    this.accessToken = accessToken || null;
    this.refreshToken = refreshToken || null;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getUserFromLocalStorage() {
    return localStorage.getItem('loggedUser');
  }
}

