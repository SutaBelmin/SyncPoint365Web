import BaseService from "./baseService"

class CountriesService extends BaseService {
    async getList(signal = null) {
        const response = await this.api.get(`/countries/list`, {
            signal: signal
        });
        return response;
    }

    async add(countryData, signal = null) {
        const response = await this.api.post(`/countries`, countryData, {
            signal: signal,
        });
        return response.data;
    }

    async update(countryData, signal = null) {
        const response = await this.api.put(`/countries`, countryData, {
            signal: signal,
        });
        return response.data;
    }

    async delete(countryId, signal = null) {
        const response = await this.api.delete(`/countries/${countryId}`, {
            signal: signal,
        });
        return response.data;
    }


    async getPagedList(filters, signal = null) {
        const response = await this.api.get(
            `/countries/paged`, 
            {
                params: {
                    page: filters.page,
                    pageSize: filters.pageSize,
                    query: filters.searchQuery || '', 
                    orderBy: filters.orderBy
                },
                signal: signal
            }
        );
        return response;
    }
}

const countriesService = new CountriesService();
export default countriesService;