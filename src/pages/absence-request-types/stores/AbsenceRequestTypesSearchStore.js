import { makeAutoObservable } from 'mobx';

class AbsenceRequestTypesSearchStore {
    searchQuery = '';
    isActive = null;
    pageNumber = 1;
    pageSize = 10;
    totalItemCount = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setQuery(value) {
        this.searchQuery = value;
        this.syncWithQueryParams();
    }

    setIsActive(value) {
        this.isActive = value;
        this.syncWithQueryParams();
    }

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
        this.syncWithQueryParams();
    }

    setPageNumber(value) {
        this.pageNumber = value;
        this.syncWithQueryParams();
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    get absenceRequestFilter() {
        return {
            isActive: this.isActive,
            query: this.searchQuery,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
        };
    }

    reset() {
        this.pageSize = 10;
        this.pageNumber = 1;
        this.searchQuery = '';
        this.isActive = null;
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();

        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if (this.isActive !== null)
            params.set("status", this.isActive ? 'active' : 'inactive');
        
        if (this.pageNumber !== 1)
            params.set("page", this.pageNumber);

        if (this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        return params;
    }

    initializeQueryParams(searchParams) {
        const searchQuery = searchParams.get("searchQuery") || '';
        const status = searchParams.get("status");
        this.setQuery(searchQuery);
        this.setIsActive(status === null ? null : (status === 'active'));
    }
}

const absenceRequestTypesSearchStore = new AbsenceRequestTypesSearchStore();
export default absenceRequestTypesSearchStore;