import BaseService from "./baseService";

class UsersService extends BaseService {

    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }

    async getPagedUsers(page = 1, pageSize = 10, signal = null) {

        const response = await this.api.get(`/users/paged-list`, {
            params: {
                page: page,
                pageSize: pageSize
            },
            signal: signal
        }
        );
        return response;
    }

    async getPagedUsersFilter(filter, signal = null) {
        const response = await this.api.get(`/users/paged`, {
            params: {
                isActive: filter.isActive,
                query: filter.searchQuery,
                roleId: filter.roleId,
                page: filter.page,
                pageSize: filter.pageSize,
            },
            signal: signal
        }
        );
        return response;
    }


    async updateUserStatus(id) {
        const response = await this.api.post(`/users/change-status?id=${id}`);
        return response;
    }

    async add(userData) {
        const dataToSend = {
            ...userData,
            role: userData.roleId
        };

        const response = await this.api.post(`/users`, dataToSend);

        return response.data;
    }

    async emailExists(email) {
        const response = await this.api.get('/users/email-exists', {
            params: {
                email: email
            }
        });
        return response.data;
    }

    async getById(userId) {
        const response = await this.api.get(`/users/${userId}`)
        return response;
    }

    async update(userData) {
        const response = await this.api.put(`/users`, userData);
        return response;
    }
    
    async changePassword(id, password) {
        const response = await this.api.put(`users/change-password?id=${id}&password=${password}`);
        return response.data;
    }
}

const usersService = new UsersService();
export default usersService;