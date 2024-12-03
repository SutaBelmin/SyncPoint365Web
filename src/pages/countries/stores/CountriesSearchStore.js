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

  setRowsPerPage(rows) {
    this.rowsPerPage = rows;
    this.syncWithQueryParams();
  }

  setTotalItemCount(count) {
    this.totalItemCount = count;
  }

  resetFilters() {
    this.searchQuery = "";
    this.page = 1;
    this.rowsPerPage = 10;
    this.syncWithQueryParams();
  }

  syncWithQueryParams() {
    const params = new URLSearchParams();

    if(this.searchQuery) 
      params.set("searchQuery", this.searchQuery);

    if(this.page !== 1) 
      params.set("page", this.page);

    if(this.rowsPerPage !== 10) 
      params.set("rowsPerPage",this.rowsPerPage);
  }

  initializeQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("searchQuery") || "";
    this.setSearchQuery(searchQuery);
  }
}
const countriesSearchStore = new CountriesStore();
export default countriesSearchStore;