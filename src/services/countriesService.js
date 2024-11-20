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

    async getPagedList(page, rowsPerPage, searchTerm = '') {
        const query = searchTerm ? `&query=${searchTerm}` : '';
        const response = await this.api.get(`/countries/paged/${page}?pageSize=${rowsPerPage}${query}`);
        return response;
    }
}

const countriesService = new CountriesService();
export default countriesService;