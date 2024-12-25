import BaseService from "./baseService";


class EnumsService extends BaseService {
    async getRoles(signal = null) {
        const response = await this.api.get("/enums/roles", {
            signal: signal
        });
        return response;
    }

    async getGenders(signal = null) {
        const response = await this.api.get("/enums/genders", {
            signal: signal
        });
        return response;
    }

    async getAbsenceRequestsStatus(signal = null) {
        const response = await this.api.get("/enums/absence-requests-status", {
            signal: signal
        });
        return response;
    }

}

const enumsService = new EnumsService();
export default enumsService;