import BaseService from "./baseService"

class CountriesService extends BaseService{
    async getList() {
        const response = await this.api.get(`/countries/get-countries`, {
            cancelToken: null
        });
        return response;
    }

    async add(countryData){
        const response = await this.api.post(`/countries`, countryData, {
            cancelToken: null,
        });
        return response.data;
    }
}

const countriesService = new CountriesService();
export default countriesService;