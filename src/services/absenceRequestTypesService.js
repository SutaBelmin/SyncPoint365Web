import BaseService from "./baseService";


class AbsenceRequestTypesService extends BaseService {
    async getList() {
        const response = await this.api.get("/absence-request-types/list", {
            cancelToken: null
        });
        return response;
    }
    async getPagedList(filter, signal = null) {
        const response = await this.api.get(
            `/absence-request-types/paged`, 
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
        const response = await this.api.post(`/absence-request-types`, absenceRequestTypesData, {
            cancelToken: null,
        });
        return response.data;
    }
    async update(absenceRequestTypesData){
        const response = await this.api.put(`/absence-request-types`, absenceRequestTypesData, {
            cancelToken: null,
        });
        return response.data;
    }
    async delete(absenceRequestTypesId){
        const response = await this.api.delete(`/absence-request-types/${absenceRequestTypesId}`, {
            cancelToken: null,
        });
        return response.data;
    }
}

const absenceRequestTypes = new AbsenceRequestTypesService();
export default absenceRequestTypes;