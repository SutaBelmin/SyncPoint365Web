import { action, makeObservable, observable } from "mobx";

class CitiesListStore {
    totalItemCount = 0;
    countryId = null;
    searchQuery = "";
    page = 1;
    rowsPerPage = 10;

    constructor() {
        makeObservable(this, {
            totalItemCount: observable,
            page: observable,
            rowsPerPage: observable,
            setQuery: action,
            setCountryId: action,
            setTotalItemCount: action,
            setPage: action,
            setRowsPerPage: action,
            clearFilters: action,
        });
    }

    setQuery(query) {
        this.searchQuery = query;
    }

    setCountryId(countryId){
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
        this.setCountryId(0);
        this.setQuery(""); 
        this.setPage(1);
    }
}

const citiesListStore= new CitiesListStore();
export default citiesListStore;