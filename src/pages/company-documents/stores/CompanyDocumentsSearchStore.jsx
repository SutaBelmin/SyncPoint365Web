import { makeObservable, action, observable } from "mobx";


class CompanyDocumentsSearchStore {
    totalItemCount = 0;
    searchQuery = "";
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
    }

    get companyDocumentFilter() {
        return {
            searchQuery: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize,
        };
    }
}

const companyDocumentsSearchStore = new CompanyDocumentsSearchStore();
export default companyDocumentsSearchStore;