import BaseService from "./baseService";


class AbsenceRequestTypesService extends BaseService {
    async getList(isActive = null, signal = null) {
        const response = await this.api.get("/absence-request-types/list", {
            params: {
            isActive: isActive,
            },
            signal: signal
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
                    page: filter.page,
                    pageSize: filter.pageSize,
                    sortOrder: filter.sortOrder,
                },
                signal: signal
            }
        );
        return response.data;
    }

    async add(absenceRequestTypesData, signal = null) {
        const response = await this.api.post(`/absence-request-types`, absenceRequestTypesData, {
            signal: signal,
        });
        return response.data;
    }

    async update(absenceRequestTypesData, signal = null) {
        const response = await this.api.put(`/absence-request-types`, absenceRequestTypesData, {
            signal: signal,
        });
        return response.data;
    }
    
    async delete(absenceRequestTypesId, signal = null) {
        const response = await this.api.delete(`/absence-request-types/${absenceRequestTypesId}`, {
            signal: signal,
        });
        return response.data;
    }
}

const absenceRequestTypes = new AbsenceRequestTypesService();
export default absenceRequestTypes;