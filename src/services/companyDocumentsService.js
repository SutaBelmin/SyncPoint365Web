import BaseService from "./baseService";


class CompanyDocumentsService extends BaseService {
    getList(filter, signal = null) {
        const response = this.api.get("/companyDocuments/paged", {
            params: {
                query: filter.searchQuery,
                page: filter.page,
                pageSize: filter.pageSize
            },
            signal: signal,
        });
        return response;
    }

}

const companyDocumentsService = new CompanyDocumentsService();
export default companyDocumentsService;