import BaseService from "./baseService"

class CountriesService extends BaseService {
    async getList() {
        const response = await this.api.get(`/countries/list`, {
            cancelToken: null
        });
        return response;
    }

    async add(countryData) {
        const response = await this.api.post(`/countries`, countryData, {
            cancelToken: null,
        });
        return response.data;
    }

    async update(countryData) {
        const response = await this.api.put(`/countries`, countryData, {
            cancelToken: null,
        });
        return response.data;
    }

    async delete(countryId) {
        const response = await this.api.delete(`/countries/${countryId}`, {
            cancelToken: null,
        });
        return response.data;
    }

    async getPagedList(filters) {
        const { page, rowsPerPage, searchQuery } = filters;  
        const response = await this.api.get(`/countries/paged/${page}?pageSize=${rowsPerPage}&query=${searchQuery ? searchQuery : ''}`);
        return response;
      }
}

const countriesService = new CountriesService();
export default countriesService;