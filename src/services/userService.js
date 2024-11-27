import BaseService from "./baseService";

class UserService extends BaseService {

    async getUsers() {
        const response = await this.api.get("/users/get-users", {
            cancelToken: null
        });
        return response;
    }

    async getPagedUsers(page = 1, signal = null) {
        try {
            const response = await this.api.get(`/users/paged/${page}`,
                {
                    cancellationToken: signal,
                }
            );
            return response;
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Request aborted:", error.message);
            } else {
                console.error("Error in getPagedUsers:", error);
                throw error;
            }
        }
    }
}

const userService = new UserService();
export default userService;