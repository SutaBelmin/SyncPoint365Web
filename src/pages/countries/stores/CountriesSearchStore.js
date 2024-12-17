import {makeObservable, action, observable } from "mobx";

class CountriesStore {
  totalItemCount = 0;
  searchQuery = "";
  page = 1;
  rowsPerPage = 10;
  orderBy = "";

  constructor() {
    makeObservable(this, {
      setPage: action,
      setPageSize: action,
      setTotalItemCount: action,
      page: observable,
      rowsPerPage: observable,
      totalItemCount: observable,
    });

    this.initializeQueryParams();
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
    this.setSearchQuery("");
    this.setPage(1);
    this.searchQuery = "";
    this.page = 1;
    this.rowsPerPage = 10;
    this.orderBy = "";
    this.syncWithQueryParams();
  }

  setOrderBy(order) {
    this.orderBy = order;
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

    if(this.orderBy)
      params.set("orderBy", this.orderBy);

    return params;
  }

  initializeQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("searchQuery") || "";
    const orderBy = params.get("orderBy") || 'name|asc';
    this.setSearchQuery(searchQuery);
    this.setOrderBy(orderBy);
  }

  get countryFilter() {
    return {
      searchQuery: this.searchQuery,
      page: this.page,
      rowsPerPage: this.rowsPerPage,
    };
  }

}
const countriesSearchStore = new CountriesStore();
export default countriesSearchStore;