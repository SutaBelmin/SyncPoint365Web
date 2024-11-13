import BaseService from "./baseService";


class CityService extends BaseService {
    async getCities() {
        const response = this.api.get("/cities/get-cities");
        return response;
    }
}

const cityService = new CityService();
export default cityService;