import BaseService from "./baseService";


class EnumsService extends BaseService {
    async getEnums() {
        const response = await this.api.get("/enums/roles");
        return response;
    }

}

const enumsService = new EnumsService();
export default enumsService;