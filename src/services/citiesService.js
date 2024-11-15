import BaseService from "./baseService";


class CityService extends BaseService {
    async getList() {
        const response = this.api.get("/cities/list");
        return response;
    }

    async add(cityData){
        const response = await this.api.post(`/cities`, cityData, {
            cancelToken: null,
        });
        return response.data;
    }

    async update(updatedCityData) {
        const response = await this.api.put(`/cities`, updatedCityData, {
            cancelToken: null,
        });
        return response.data;
    }
}

const cityService = new CityService();
export default cityService;