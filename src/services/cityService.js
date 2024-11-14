import BaseService from "./baseService";


class CityService extends BaseService {
    async getList() {
        const response = this.api.get("/cities/list");
        return response;
    }
}

const cityService = new CityService();
export default cityService;