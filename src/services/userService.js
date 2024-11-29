import BaseService from "./baseService";

class UserService extends BaseService {

    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }

    async getPagedUsers(page = 1, signal = null) {

        const response = await this.api.get(`/users/paged-list`, {
            params: {
                page: page
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
            role: userData.roleId, 
            passwordHash: "sjnosndjwid", 
            passwordSalt: "jsaancbaocnboa"

        };
       
        const response = await this.api.post(`/users`, dataToSend, {
            cancelToken: null
        });

        return response.data;
    }
}

const userService = new UserService();
export default userService;