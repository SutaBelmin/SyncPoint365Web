import { makeObservable, action, observable } from "mobx";


class CompanyDocumentsSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    dateFrom = null;
    dateTo = null;
    page = 1;
    pageSize = 10;

    constructor() {
        makeObservable(this, {
            setPage: action,
            setPageSize: action,
            page: observable,
            pageSize: observable
        });
    }

    setDateFrom(value) {
        this.dateFrom = value;
    }

    setDateTo(value) {
        this.dateTo = value;
    }

    setQuery(query) {
        this.searchQuery = query;
    }

    setTotalItemCount(count) {
        this.totalItemCount = count;
    }

    setPage(page) {
        this.page = page;
    }

    setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    clearFilters() {
        this.setQuery("");
        this.setDateFrom(null);
        this.setDateTo(null);
    }

    get companyDocumentFilter() {
        return {
            searchQuery: this.searchQuery,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            page: this.page,
            pageSize: this.pageSize,
        };
    }
}

const companyDocumentsSearchStore = new CompanyDocumentsSearchStore();
export default companyDocumentsSearchStore;