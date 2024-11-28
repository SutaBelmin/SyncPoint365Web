import BaseService from "./baseService";

class UserService extends BaseService {

    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }

    async getPagedUsers(page = 1, signal = null) {

        const response = await this.api.get(`/users/paged/${page}`,
            {
                signal: signal
            }
        );
        return response;
    }
}

const userService = new UserService();
export default userService;