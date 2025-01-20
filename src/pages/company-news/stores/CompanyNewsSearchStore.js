import { makeObservable, action, observable } from "mobx";

class CompanyNewsSearchStore {
    query = null;
    dateFrom = null;
    dateTo = null;
    year = null;
    orderBy = null;
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
        this.initializeQueryParams();
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
    }

    clearFilters() {
        this.setQuery(null);
        this.setDateFrom(null);
        this.setDateTo(null);
        this.syncWithQueryParams();
    }

    syncWithQueryParams(){
        const params = new URLSearchParams();

        if(this.query)
            params.set("query", this.query)

        if(this.dateFrom)
            params.set("dateFrom", this.dateFrom);

        if(this.dateTo)
            params.set("dateTo", this.dateTo);
        
        if(this.orderBy)
            params.set("orderBy", this.orderBy);

        if(this.page)
            params.set("page", this.page);
        
        if(this.pageSize)
            params.set("pageSize", this.pageSize);

        this.currentQueryParams = params;
        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("query") || null;
        const dateFrom = params.get("dateFrom") || null;
        const dateTo = params.get("dateTo") || null;
        const orderBy = params.get("orderBy") || null;
        const page = parseInt(params.get("page")) || 1;
        const pageSize = parseInt(params.get("pageSize")) || 10;

        this.setQuery(query);
        this.setDateFrom(dateFrom);
        this.setDateTo(dateTo);
        this.setOrderBy(orderBy);
        this.setPage(page);
        this.setPageSize(pageSize);
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