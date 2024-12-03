import { makeAutoObservable } from "mobx";

class CitiesSearchStore {
    totalItemCount = 0;
    countryId = null;
    searchQuery = "";
    page = 1;
    rowsPerPage = 10;

    constructor() {
        makeAutoObservable(this);
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
    }

    setPage(page) {
        this.page = page;
        this.syncWithQueryParams();
    }

    setRowsPerPage(rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
        this.syncWithQueryParams();
    }

    clearFilters() {
        this.setCountryId(null);
        this.setQuery(""); 
        this.setPage(1);
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
      
        if(this.rowsPerPage !== 10) 
            params.set("rowsPerPage", this.rowsPerPage);

        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get("searchQuery") || "";
        const countryId = params.get("countryId") || null;

        this.setQuery(searchQuery);
        this.setCountryId(countryId);
    }

    get cityFilter() {
        return {
            totalItemCount: this.totalItemCount,
            countryId: this.countryId,
            searchQuery: this.searchQuery,
            page: this.page,
            rowsPerPage: this.rowsPerPage
        };
    }
}

const citiesSearchStore = new CitiesSearchStore();
export default citiesSearchStore;