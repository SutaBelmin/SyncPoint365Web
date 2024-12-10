import BaseService from "./baseService";


class AbsenceRequestsService extends BaseService {
    async getPagedList(filter, signal = null) {
        const response = await this.api.get(
            `/absencerequests/paged`, 
            {
                params: {
                    absenceRequestTypeId: filter.absenceRequestTypeId,
                    userId: filter.userId, 
                    dateFrom: filter.dateFrom,
                    dateTo: filter.dateTo,
                    page: filter.page, 
                    pageSize: filter.pageSize,
                },
                signal: signal,
                
            }
        );
        return response;
    }
    async add(absenceRequestData){
        const response = await this.api.post(`/absencerequests`, absenceRequestData, {
            cancelToken: null,
        });
        return response.data;
    }
    async update(absenceRequestData){
        const response = await this.api.put(`/absencerequests`, absenceRequestData, {
            cancelToken: null,
        });
        return response.data;
    }
    async delete(absenceRequestId){
        const response = await this.api.delete(`/absencerequests/${absenceRequestId}`, {
            cancelToken: null,
        });
        return response.data;
    }
}

const absenceRequests = new AbsenceRequestsService();
export default absenceRequests;