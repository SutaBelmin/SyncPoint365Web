import BaseService from "./baseService";

class UsersService extends BaseService {

    async getUsers(signal = null) {
        const response = await this.api.get("/users/get-users", {
            signal: signal
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
                orderBy: filter.orderBy,
                page: filter.page,
                pageSize: filter.pageSize
            },
            signal: signal
        }
        );
        return response;
    }

    async updateUserStatus(id, signal = null) {
        const response = await this.api.put(`/users/change-status?id=${id}`, {
            signal: signal
        });
        return response;
    }

    async add(userData, signal) {
        const response = await this.api.post(`/users`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            },
            signal
        });
    
        return response.data;
    }

    async emailExists(email, signal = null) {
        const response = await this.api.get('/users/email-exists', {
            params: {
                email: email
            },
            signal: signal
        });
        return response.data;
    }

    async getById(userId, signal = null) {
        const response = await this.api.get(`/users/${userId}`, {
            signal: signal
        })
        return response;
    }   

    async update(userData, signal) {
        const response = await this.api.put(`/users`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }, 
            signal
        });
        return response;
    }
    
    async changePassword(user, signal = null) {
        const response = await this.api.put('users/change-password', user, {
            signal: signal
        });
        return response.data;
    }       
}

const usersService = new UsersService();
export default usersService;