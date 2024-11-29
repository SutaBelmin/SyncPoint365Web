import BaseService from "./baseService";


class EnumService extends BaseService {
    async getEnums() {
        const response = await this.api.get("/enums/roles");
        return response;
    }

}

const enumService = new EnumService();
export default enumService;