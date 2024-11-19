import BaseService from "./baseService";

class UserService extends BaseService {
    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }

    async getPagedUsers(page = 1, cancelToken = null) {
        try {
            const response = await this.api.get(`/users/paged/${page}`, {
                cancelToken: cancelToken,
            });
            return response; 
        } catch (error) {
            
        }
    }
}

const userService = new UserService();
export default userService;