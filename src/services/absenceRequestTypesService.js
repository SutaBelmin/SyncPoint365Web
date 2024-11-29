import BaseService from "./baseService";


class AbsenceRequestTypesService extends BaseService {
    async getList() {
        const response = await this.api.get("/absencerequesttypes/list", {
            cancelToken: null
        });
        return response;
    }
    async getPagedList(filter, signal = null) {
        const response = await this.api.get(
            `/absencerequesttypes/paged`, 
            {
                params: {
                    isActive: filter.isActive,
                    query: filter.query,
                    page: filter.pageNumber,
                    pageSize: filter.pageSize,
                },
                signal: signal
            }
        );
        return response.data;
    }
    async add(absenceRequestTypesData){
        const response = await this.api.post(`/absencerequesttypes`, absenceRequestTypesData, {
            cancelToken: null,
        });
        return response.data;
    }
    async update(absenceRequestTypesData){
        const response = await this.api.put(`/absencerequesttypes`, absenceRequestTypesData, {
            cancelToken: null,
        });
        return response.data;
    }
    async delete(absenceRequestTypesId){
        const response = await this.api.delete(`/absencerequesttypes/${absenceRequestTypesId}`, {
            cancelToken: null,
        });
        return response.data;
    }
}

const absenceRequestTypes = new AbsenceRequestTypesService();
export default absenceRequestTypes;