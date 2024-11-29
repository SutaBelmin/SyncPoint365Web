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

    setSearchQuery(value) {
        this.searchQuery = value;
    }

    setIsActive(value) {
        this.isActive = value;
    }

    setPageNumber(page) {
        this.pageNumber = page;
    }

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
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
}

const absenceRequestTypesSearchStore = new AbsenceRequestTypesSearchStore();
export default absenceRequestTypesSearchStore;
