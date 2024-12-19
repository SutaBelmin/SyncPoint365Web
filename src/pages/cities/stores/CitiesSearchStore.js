import { makeObservable, action, observable } from "mobx";
class CitiesSearchStore {
    totalItemCount = 0;
    countryId = null;
    searchQuery = "";
    page = 1;
    pageSize = 10;
    orderBy = "";
    currentQueryParams = null;

    constructor(){
        makeObservable(this, {
            setPage: action, 
            setPageSize: action, 
            setTotalItemCount: action, 
            setOrderBy: action,
            page: observable,
            pageSize: observable,
            totalItemCount: observable,
            orderBy: observable
        });

        this.initializeQueryParams();
    }

    setQuery(query) {
        this.searchQuery = query;
        this.syncWithQueryParams();
    }

    setCountryId(countryId) {
        this.countryId = countryId;
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

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
        this.syncWithQueryParams();
    }

    setOrderBy(orderBy) {
        this.orderBy = orderBy;  
        this.syncWithQueryParams();
    }

    clearFilters() {
        this.setCountryId(null);
        this.setQuery(""); 
        this.setPage(1);
        this.setPageSize(10);
        this.setOrderBy("");
        this.syncWithQueryParams();
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();
        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);
        
        if (this.countryId)
            params.set("countryId", this.countryId);

        if(this.page !== 1) 
            params.set("page", this.page);
        
        if(this.pageSize !== 10) 
            params.set("pageSize", this.pageSize);

        if(this.totalItemCount !== 0) 
            params.set("totalItemCount", this.totalItemCount);

        if (this.orderBy)  
            params.set("orderBy", this.orderBy);

        this.currentQueryParams = params;
        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get("searchQuery") || "";
        const countryId = params.get("countryId") || null;
        const orderBy = params.get("orderBy") || "";
        const page = parseInt(params.get("page")) || 1;
        const pageSize = parseInt(params.get("pageSize")) || 10;
        const totalItemCount = parseInt(params.get("totalItemCount")) || 0;
    
        this.setQuery(searchQuery);
        this.setCountryId(countryId);
        this.setOrderBy(orderBy);
        this.setPage(page);
        this.setPageSize(pageSize);
        this.setTotalItemCount(totalItemCount);
    }

    get cityFilter() {
        return {
            totalItemCount: this.totalItemCount,
            countryId: this.countryId,
            searchQuery: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize,
            orderBy: this.orderBy
        };
    }

    get queryParams() {
        return this.currentQueryParams;
    }
}

const citiesSearchStore = new CitiesSearchStore();
export default citiesSearchStore;