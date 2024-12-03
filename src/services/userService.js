import BaseService from "./baseService";

class UserService extends BaseService {

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

    async updateUserStatus(id){
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
}

const userService = new UserService();
export default userService;