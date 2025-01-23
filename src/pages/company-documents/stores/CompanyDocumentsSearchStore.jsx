import { makeObservable, action, observable } from "mobx";

class CompanyDocumentsSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    dateFrom = null;
    dateTo = null;
    page = 1;
    pageSize = 10;
    currentQueryParams = null;

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
        this.syncWithQueryParams();
    }

    setDateTo(value) {
        this.dateTo = value;
        this.syncWithQueryParams();
    }

    setQuery(query) {
        this.searchQuery = query;
        this.syncWithQueryParams();
    }

    setTotalItemCount(count) {
        this.totalItemCount = count;
        this.syncWithQueryParams();
    }

    setPage(page) {
        this.page = page;
        this.syncWithQueryParams();
    }

    setPageSize(pageSize) {
        this.pageSize = pageSize;
        this.syncWithQueryParams();
    }

    clearFilters() {
        this.setQuery("");
        this.setDateFrom(null);
        this.setDateTo(null);
        this.syncWithQueryParams();
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();
        if(this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if(this.dateFrom)
            params.set("dateFrom", this.dateFrom);

        if(this.dateTo)
            params.set("dateTo", this.dateTo);

        if (this.page) {
            params.set("page", this.page);
        }

        if (this.pageSize)
            params.set("pageSize", this.pageSize);

        this.currentQueryParams = params;
        return params;
    }

    initializeQueryParams(searchParams) {
        const params = new URLSearchParams(searchParams);
        
        const searchQuery = params.get("searchQuery") || "";
        const dateFrom = params.get("dateFrom") || null;
        const dateTo = params.get("dateTo") || null;
        const page = parseInt(params.get("page")) || 1; 
        const pageSize = parseInt(params.get("pageSize")) || 10;

        this.setQuery(searchQuery);
        this.setDateFrom(dateFrom);
        this.setDateTo(dateTo);
        this.setPage(page);
        this.setPageSize(pageSize);
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

    get queryParams() {
        return this.currentQueryParams;
    }
}

const companyDocumentsSearchStore = new CompanyDocumentsSearchStore();
export default companyDocumentsSearchStore;