import BaseService from "./baseService";

class CompanyNewsService extends BaseService {
    async getPagedList(filter, signal = null) {
        const response = await this.api.get(
            "/company-news/paged",
            {
                params: {
                    query: filter.query,
                    isVisible: filter.isVisible,
                    dateFrom: filter.dateFrom,
                    dateTo: filter.dateTo,
                    orderBy: filter.orderBy,
                    page: filter.page,
                    pageSize: filter.pageSize,
                },
                signal: signal
            }
        );
        return response.data;
    }

    async add(companyNewsData, signal = null) {
        const response = await this.api.post(`/company-news/add`, companyNewsData, {
            signal: signal,
        });
        return response.data;
    }

    async update(companyNewsData, signal = null) {
        const response = await this.api.put(`/company-news`, companyNewsData, {
            signal: signal,
        });
        return response.data;
    }
    
    async delete(companyNewsId, signal = null) {
        const response = await this.api.delete(`/company-news/${companyNewsId}`, {
            signal: signal,
        });
        return response.data;
    }

    async updateVisibility(id) {
        const response = await this.api.put(`/company-news/change-visibility?id=${id}`);
        return response.data;
    }
}

const companyNews = new CompanyNewsService();
export default companyNews;