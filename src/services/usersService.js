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

    async getPagedUsersFilter(filterParams, signal = null) {
        const response = await this.api.get(`/users/filter`, {
            params: {
                // isActive: null,
                query: filterParams.searchQuery,
                roleId: filterParams.roleId,
                page: filterParams.page,
                pageSize: filterParams.pageSize,
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
}

const usersService = new UsersService();
export default usersService;