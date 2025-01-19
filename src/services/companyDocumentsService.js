import BaseService from "./baseService";


class CompanyDocumentsService extends BaseService {
    getList(filter, signal = null) {
        const response = this.api.get("/companyDocuments/paged", {
            params: {
                dateFrom: filter.dateFrom,
                dateTo: filter.dateTo,
                query: filter.searchQuery,
                page: filter.page,
                pageSize: filter.pageSize
            },
            signal: signal,
        });
        return response;
    }

    updateDocumentVisibility(documentId, isVisibile, signal = null) {

        const response = this.api.patch(`/companyDocuments/update-document-visibility?documentId=${documentId}&isVisibile=${isVisibile}`,
            { signal: signal });

        return response;
    }

}

const companyDocumentsService = new CompanyDocumentsService();
export default companyDocumentsService;