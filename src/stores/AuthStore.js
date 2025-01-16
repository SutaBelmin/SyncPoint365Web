export class AuthStore {
  constructor() {
    this.initialize();
  }

  setUser(user, token) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.loggedUser = user;
    this.token = token;
  }

  removeUser() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
    this.loggedUser = null;
    this.token = null;
  }

  getUser() {
    return this.loggedUser;
  }

  initialize() {
    const loggedUser = localStorage.getItem('loggedUser');
    const token = localStorage.getItem('token');
    this.loggedUser = loggedUser ? JSON.parse(loggedUser) : null;
    this.token = token || null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

}

