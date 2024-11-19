import BaseService from "./baseService";


class CitiesService extends BaseService {
    async getList() {
        const response = this.api.get("/cities/list");
        return response;
    }

    async add(cityData) {
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

    async delete(cityId) {
        const response = await this.api.delete(`/cities/${cityId}`, {
            cancelToken: null,
        });
        return response.data;
    }

    async getPagedCities(countryId = null, query = "",page = 1, pageSize = 10, cancelToken = null) {
        try {
            const response = await this.api.get(`/cities/paged`, {
                params: {
                    countryId,
                    query,
                    page,
                    pageSize
                },
                cancelToken: cancelToken,
            });
            return response;
        } catch (error) {

        }
    }
}

const citiesService = new CitiesService();
export default citiesService;