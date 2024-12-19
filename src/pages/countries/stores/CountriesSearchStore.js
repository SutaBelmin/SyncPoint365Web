import { action, makeObservable, observable } from "mobx";

class CountriesStore {
  totalItemCount = 0;
  searchQuery = "";
  page = 1;
  rowsPerPage = 10;
  orderBy = "";
  currentQueryParams = null;

  constructor() {
    makeObservable(this, {
      setPage: action,
      setPageSize: action,
      setTotalItemCount: action,
      setOrderBy: action,
      page: observable,
      rowsPerPage: observable,
      totalItemCount: observable,
      orderBy: observable
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
    this.rowsPerPage = newPageSize;
    this.syncWithQueryParams();
  }

  setRowsPerPage(rows) {
    this.rowsPerPage = rows;
    this.syncWithQueryParams();
  }

  setTotalItemCount(count) {
    this.totalItemCount = count;
    this.syncWithQueryParams();
  }

  resetFilters() {
    this.setSearchQuery("");
    this.setPage(1);
    this.setPageSize(10);
    this.setOrderBy("");
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

    this.currentQueryParams = params;

    return params;
  }

  initializeQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("searchQuery") || "";
    const orderBy = params.get("orderBy") || "";
    const page = parseInt(params.get("page")) || 1;
    const pageSize = parseInt(params.get("rowsPerPage")) || 10;
    const totalItemCount = parseInt(params.get("totalItemCount"));

    this.setSearchQuery(searchQuery);
    this.setOrderBy(orderBy);
    this.setPage(page);
    this.setRowsPerPage(pageSize);
    this.setTotalItemCount(totalItemCount);
  }
  
  get queryParams() {
    return this.currentQueryParams;
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