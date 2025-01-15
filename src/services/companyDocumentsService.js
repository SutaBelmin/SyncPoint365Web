import BaseService from "./baseService";


class CompanyDocumentsService extends BaseService {
    getList(signal = null) {
        const response = this.api.get("/companyDocuments/paged-list", {
            signal: signal,
        });
        return response;
    }

}

const companyDocumentsService = new CompanyDocumentsService();
export default companyDocumentsService;