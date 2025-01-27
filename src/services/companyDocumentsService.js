import BaseService from "./baseService";

class CompanyDocumentsService extends BaseService {
    getList(filter, signal = null) {
        const response = this.api.get("/companyDocuments/paged", {
            params: {
                dateFrom: filter.dateFrom,
                dateTo: filter.dateTo,
                query: filter.searchQuery,
                isVisible: filter.isVisible,
                page: filter.page,
                pageSize: filter.pageSize
            },
            signal: signal,
        });
        return response;
    }

    updateDocumentVisibility(id, signal = null) {
        const response = this.api.patch('/companyDocuments/update-company-document-visibility', null, {
            params: {
                id: id
            },
            signal: signal
        });
        
        return response;
    }

    async add(data, signal = null) {
        const response = await this.api.post(`/companyDocuments`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            signal: signal
        });

        return response.data;
    }

    async update(data, signal = null) {
        const response = await this.api.put(`/companyDocuments`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            signal: signal
        });

        return response.data;
    }

    async delete(companyDocumentId, signal = null) {
        const response = await this.api.delete(`/companyDocuments/${companyDocumentId}`, {
            signal: signal
        });
        return response.data;
    }

}

const companyDocumentsService = new CompanyDocumentsService();
export default companyDocumentsService;