import BaseService from "./baseService";

class UserService extends BaseService {
    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }
}

const userService = new UserService();
export default userService;