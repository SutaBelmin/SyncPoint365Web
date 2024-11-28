import BaseService from "./baseService"

class CountriesService extends BaseService {
    async getList(signal = null) {
        const response = await this.api.get(`/countries/list`, {
            cancellationToken: signal
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


    async getPagedList(filters, signal = null) {
        const response = await this.api.get(
            `/countries/paged-list`, 
            {
                params: {
                    page: filters.page,
                    pageSize: filters.pageSize,
                    query: filters.searchQuery || '', 
                },
                signal: signal
            }
        );
        return response;
    }
}

const countriesService = new CountriesService();
export default countriesService;