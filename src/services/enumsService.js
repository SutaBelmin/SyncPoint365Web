import BaseService from "./baseService";


class EnumsService extends BaseService {
    async getRoles() {
        const response = await this.api.get("/enums/roles");
        return response;
    }

    async getGenders() {
        const response = await this.api.get("/enums/genders");
        return response;
    }

    async getAbsenceRequestsStatus() {
        const response = await this.api.get("/enums/absence-requests-status");
        return response;
    }

}

const enumsService = new EnumsService();
export default enumsService;