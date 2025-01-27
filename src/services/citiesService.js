import BaseService from "./baseService";


class CitiesService extends BaseService {
    async getList(signal = null) {
        const response = this.api.get("/lookup/cities", {
            signal: signal,
        });
        return response;
    }

    async add(cityData, signal = null) {
        const response = await this.api.post(`/cities`, cityData, {
            signal: signal,
        });
        return response.data;
    }

    async update(updatedCityData, signal = null) {
        const response = await this.api.put(`/cities`, updatedCityData, {
            signal: signal,
        });
        return response.data;
    }

    async delete(cityId, signal = null) {
        const response = await this.api.delete(`/cities/${cityId}`, {
            signal: signal,
        });
        return response.data;
    }

    async getPagedCities(filter, signal = null) {
        const response = await this.api.get(`/cities/paged`, {
            params: {
                countryId: filter.countryId,
                query: filter.searchQuery,
                orderBy: filter.orderBy,
                page: filter.page,
                pageSize: filter.pageSize
            },
            signal: signal
        });
        return response;
    }
}

const citiesService = new CitiesService();
export default citiesService;