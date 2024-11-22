import { makeAutoObservable } from 'mobx';

class AbsenceRequestTypesListStore {
    searchQuery = '';
    isActive = null;
    pageNumber = 1;
    rowsPerPage = 10;
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

    setPageNumber(value) {
        this.pageNumber = value;
    }

    setRowsPerPage(value) {
        this.rowsPerPage = value;
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    get absenceRequestFilter() {
        return {
            pageNumber: this.pageNumber,
            pageSize: this.rowsPerPage,
            query: this.searchQuery,
            isActive: this.isActive,
        };
    }

    reset() {
        this.rowsPerPage = 10;
        this.pageNumber = 1;
        this.searchQuery = '';
        this.isActive = null;
    }
}

const absenceRequestTypesListStore = new AbsenceRequestTypesListStore();
export default absenceRequestTypesListStore;
