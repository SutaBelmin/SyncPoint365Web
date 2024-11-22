import { action, computed, makeObservable, observable } from "mobx";

class CountriesStore {
  page = 1;
  totalItemCount = 0;
  rowsPerPage = 10;
  searchQuery = "";

  constructor() {
    makeObservable(this, {
      page: observable,
      totalItemCount: observable,
      rowsPerPage: observable,
      searchQuery: observable,
      filterObject: computed,
      setSearchQuery: action,
      setPage: action,
      setRowsPerPage: action,
      setTotalItemCount: action,
      resetFilters: action,
    });
  }

  get filterObject() {
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
