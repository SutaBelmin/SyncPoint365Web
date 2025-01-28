import axios from 'axios';
import { eventEmitter } from '../utils';

class BaseService {
	constructor() {
		this.api = axios.create({
			baseURL: process.env['REACT_APP_API_URL'],
			headers: {
				'Content-Type': 'application/json',
			},
		});
		this.isRefreshing = false;
		this.refreshSubscribers = [];

		this.api.interceptors.request.use(
			(config) => {
				const accessToken = localStorage.getItem('accessToken');
				if (accessToken) {
					config.headers['Authorization'] = `Bearer ${accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.api.interceptors.response.use(
			(response) => response,
			(error) => this.handleResponseError(error));
	}

	addRefreshSubscriber(callback) {
		this.refreshSubscribers.push(callback);
	}

	notifySubscribers(newToken) {
		this.refreshSubscribers.forEach((callback) => callback(newToken));
		this.refreshSubscribers = [];
	}

	async handleResponseError(error) {
		const originalRequest = error.config;

		if (!originalRequest.url.includes("/auth/") && error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (!this.isRefreshing) {
				this.isRefreshing = true;

				try {
					const newAccessToken = await this.refreshAccessToken();
					this.notifySubscribers(newAccessToken);
					this.isRefreshing = false;
					return this.api(originalRequest);
				} catch (refreshError) {
					this.isRefreshing = false;
					return Promise.reject(refreshError);
				}
			}

			return new Promise((resolve) => {
				this.addRefreshSubscriber((newToken) => {
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
					resolve(this.api(originalRequest));
				});
			});
		}
		else if ((error.response?.data?.code === "TOKEN_EXPIRED" || error.response?.data?.code === "TOKEN_EMPTY")) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('loggedUser');
			eventEmitter.emit('navigateToLogin');
		}
		return Promise.reject(error);
	}

	async refreshAccessToken() {
		const refreshToken = localStorage.getItem('refreshToken');
		const response = await this.api.get("/auth/validate-token", {
			params: {
				refreshToken: refreshToken
			},
		});
		const newAccessToken = response?.data;
		localStorage.setItem('accessToken', newAccessToken);
		return newAccessToken;
	}
}

export default BaseService;
