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
        const response = await this.api.post(`/users/change-status?id=${id}`, {
            signal: signal
        });
        return response;
    }

    async add(userData, signal = null) {
        const dataToSend = {
            ...userData,
            role: userData.roleId
        };

        const response = await this.api.post(`/users`, dataToSend, {
            signal: signal
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

    async update(userData, signal = null) {
        const response = await this.api.put(`/users`, userData, {
            signal: signal
        });
        return response;
    }
    
    async changePassword(user, signal = null) {
        const response = await this.api.put('users/change-password', user, {
            signal: signal
        });
        return response.data;
    }    

    async uploadProfilePicture(file){
        const formData = new FormData();
        formData.append("File", file);

        const response = await this.api.post('/users/upload-profile-picture', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response;
    }
}

const usersService = new UsersService();
export default usersService;