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
    }

    setCountryId(countryId) {
        this.countryId = countryId;
    }

    setTotalItemCount(count) {
        this.totalItemCount = count;
    }

    setPage(page) {
        this.page = page;
    }

    setRowsPerPage(rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
    }

    clearFilters() {
        this.setCountryId(null);
        this.setQuery(""); 
        this.setPage(1);
    }

    get cityFilter() {
        const filter = {
            totalItemCount: this.totalItemCount,
            countryId: this.countryId,
            searchQuery: this.searchQuery,
            page: this.page,
            rowsPerPage: this.rowsPerPage
        };
        return filter;
    }
}

const citiesSearchStore = new CitiesSearchStore();
export default citiesSearchStore;