import { makeAutoObservable } from "mobx";

class CountriesStore {
  page = 1;
  totalItemCount = 0;
  rowsPerPage = 10;
  searchQuery = "";

  constructor() {
    makeAutoObservable(this);
  }

  get countryFilter() {
    return {
      searchQuery: this.searchQuery,
      page: this.page,
      rowsPerPage: this.rowsPerPage,
    };
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  setPage(page) {
    this.page = page;
  }

  setRowsPerPage(rows) {
    this.rowsPerPage = rows;
  }

  setTotalItemCount(count) {
    this.totalItemCount = count;
  }

  resetFilters() {
    this.searchQuery = "";
    this.page = 1;
    this.rowsPerPage = 10;
  }
}

const countriesSearchStore = new CountriesStore();
export default countriesSearchStore;
