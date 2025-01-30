import { makeObservable, action, observable } from "mobx";

class CompanyNewsSearchStore {
    query = "";
    dateFrom = null;
    dateTo = null;
    year = null;
    orderBy = "";
    page = 1;
    pageSize = 10;
    totalItemCount = 0;
    currentQueryParams = null;


    constructor(){
        makeObservable(this, {
            setPage: action, 
            setPageSize: action, 
            setOrderBy: action,
            page: observable,
            pageSize: observable,
            orderBy: observable
        });
    }
    
    setQuery(value) {
        this.query = value;
        this.syncWithQueryParams();
    }

    setDateFrom(value) {
        this.dateFrom = value;
        this.syncWithQueryParams();
    }

    setDateTo(value) {
        this.dateTo = value;
        this.syncWithQueryParams();
    }

    setOrderBy(value) {
        this.orderBy = value;
        this.syncWithQueryParams();
    }

    setPage(value) {
        this.page = value;
        this.syncWithQueryParams();
    }

    setPageSize(value) {
        this.pageSize = value;
        this.syncWithQueryParams();
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
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
    
        if (this.query) params.set("query", this.query);
        if (this.dateFrom) params.set("dateFrom", this.dateFrom.toISOString());
        if (this.dateTo) params.set("dateTo", this.dateTo.toISOString());
        if (this.orderBy) params.set("orderBy", this.orderBy);
        if (this.page) params.set("page", this.page);
        if (this.pageSize) params.set("pageSize", this.pageSize);
    
        this.currentQueryParams = params;
        return params;
    }
    
    initializeQueryParams(searchParams) {
        const params = new URLSearchParams(searchParams);
    
        this.setQuery(params.get("query") || "");
        this.setDateFrom(params.get("dateFrom") ? new Date(params.get("dateFrom")) : null);
        this.setDateTo(params.get("dateTo") ? new Date(params.get("dateTo")) : null);
        this.setOrderBy(params.get("orderBy") || "");
        this.setPage(parseInt(params.get("page")) || 1);
        this.setPageSize(parseInt(params.get("pageSize")) || 10);
    }

    get companyNewsFilter() {
        return {
            query: this.query,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo, 
            orderBy: this.orderBy,
            page: this.page, 
            pageSize: this.pageSize, 
            totalItemCount: this.totalItemCount,
        };
    }

    get queryParams() {
        return this.currentQueryParams;
    }
}

const companyNewsSearchStore = new CompanyNewsSearchStore();
export default companyNewsSearchStore;