import BaseService from "./baseService";


class AbsenceRequestsService extends BaseService {
    async getPagedList(filter, signal = null) {
        const response = await this.api.get(
            "/absence-requests/paged", 
            {
                params: {
                    absenceRequestTypeId: filter.absenceRequestTypeId,
                    absenceRequestStatusId: filter.absenceRequestStatusId,
                    userId: filter.userId, 
                    dateFrom: filter.dateFrom,
                    dateTo: filter.dateTo,
                    orderBy: filter.orderBy,
                    page: filter.page, 
                    pageSize: filter.pageSize,
                },
                signal: signal,
            }
        );
        return response;
    }
    async add(absenceRequestData, signal = null){
        const response = await this.api.post(`/absence-requests`, absenceRequestData, {
            signal: signal,
        });
        return response.data;
    }
    async update(absenceRequestData, signal = null){
        const response = await this.api.put(`/absence-requests`, absenceRequestData, {
            signal: signal,
        });
        return response.data;
    }
    async delete(absenceRequestId, signal = null){
        const response = await this.api.delete(`/absence-requests/${absenceRequestId}`, {
            signal: signal,
        });
        return response.data;
    }
}

const absenceRequests = new AbsenceRequestsService();
export default absenceRequests;