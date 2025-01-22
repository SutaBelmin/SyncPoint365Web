import { makeObservable, action, observable } from "mobx";
import { absenceRequestTypeStatusConstant } from "../../../constants";

class AbsenceRequestTypesSearchStore {
    searchQuery = '';
    isActive = null;
    orderBy = '';
    page = 1;
    pageSize = 10;
    totalItemCount = 0;
    currentQueryParams = null;

    constructor() {
        makeObservable(this, {
            setPage: action,
            setPageSize: action,
            setOrderBy:action,
            page: observable,
            pageSize: observable,
            orderBy: observable
        });
    }

    setQuery(value) {
        this.searchQuery = value;
        this.syncWithQueryParams();
    }

    setIsActive(value) {
        this.isActive = value;
        this.syncWithQueryParams();
    }

    setOrderBy(value) {
        this.orderBy = value;
        this.syncWithQueryParams();
    }

    setPageSize(value) {
        this.pageSize = value;
        this.syncWithQueryParams();
    }

    setPage(value) {
        this.page = value;
        this.syncWithQueryParams();
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    clearFilters() {
        this.setQuery(""); 
        this.setIsActive(null);
        this.syncWithQueryParams();
        
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();

        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if (this.isActive !== null)
            params.set("status", this.isActive ? absenceRequestTypeStatusConstant.active : absenceRequestTypeStatusConstant.inactive);

        if(this.orderBy !== null)
            params.set("orderBy", this.orderBy);

        if (this.page)
            params.set("page", this.page);

        if (this.pageSize)
            params.set("pageSize", this.pageSize);

        this.currentQueryParams = params;
        return params;
    }

    initializeQueryParams(searchParams) {
        const params = new URLSearchParams(searchParams);

        const searchQuery = params.get("searchQuery") || '';
        const status = params.get("status");
        const orderBy = params.get("orderBy") || null;
        const page = parseInt(params.get("page")) || 1;
        const pageSize = parseInt(params.get("pageSize")) || 10;

        this.setQuery(searchQuery);
        this.setIsActive(status === null ? null : (status === absenceRequestTypeStatusConstant.all));
        this.setOrderBy(orderBy);
        this.setPage(page);
        this.setPageSize(pageSize);
    }

    get absenceRequestFilter() {
        return {
            isActive: this.isActive,
            query: this.searchQuery,
            orderBy: this.orderBy,
            page: this.page,
            pageSize: this.pageSize,
        };
    }

    get queryParams() {
        return this.currentQueryParams;
    }
}

const absenceRequestTypesSearchStore = new AbsenceRequestTypesSearchStore();
export default absenceRequestTypesSearchStore;