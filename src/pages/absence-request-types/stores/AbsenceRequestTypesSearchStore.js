import { makeObservable, action, observable } from "mobx";
import { absenceRequestTypeStatusConstant } from "../../../constants";

class AbsenceRequestTypesSearchStore {
    searchQuery = '';
    isActive = null;
    sortOrder = null;
    page = 1;
    pageSize = 10;
    totalItemCount = 0;

    constructor() {
        makeObservable(this, {
            setPage: action,
            setPageSize: action,
            setTotalItemCount: action,
            page: observable,
            pageSize: observable,
            totalItemCount: observable
        });

        this.initializeQueryParams();
    }

    setQuery(value) {
        this.searchQuery = value;
        this.syncWithQueryParams();
    }

    setIsActive(value) {
        this.isActive = value;
        this.syncWithQueryParams();
    }

    setSortOrder(value) {
        this.sortOrder = value;
        this.syncWithQueryParams();
    }

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
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
        this.setSortOrder(null);
        this.setPage(1);
        this.syncWithQueryParams();
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();

        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if (this.isActive !== null)
            params.set("status", this.isActive ? absenceRequestTypeStatusConstant.active : absenceRequestTypeStatusConstant.inactive);

        if(this.sortOrder !== null)
            params.set("sortOrder", this.sortOrder);

        if (this.page !== 1)
            params.set("page", this.page);

        if (this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get("searchQuery") || '';
        const status = params.get("status");
        const sortOrder = params.get("sortOrder");
        this.setQuery(searchQuery);
        this.setIsActive(status === null ? null : (status === absenceRequestTypeStatusConstant.all));
        this.setSortOrder(sortOrder);
    }

    get absenceRequestFilter() {
        return {
            isActive: this.isActive,
            query: this.searchQuery,
            sortOrder: this.sortOrder,
            page: this.page,
            pageSize: this.pageSize,
            totalItemCount: this.totalItemCount,
        };
    }
}

const absenceRequestTypesSearchStore = new AbsenceRequestTypesSearchStore();
export default absenceRequestTypesSearchStore;