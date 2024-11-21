import { action, computed, makeObservable, observable } from 'mobx';

class AbsenceRequestTypesListStore {
    data = []
    searchQuery = '';
    isActive = null;
    pageNumber = 1;
    rowsPerPage = 10;
    totalItemCount = 0;     

    constructor() {
        makeObservable(this, {
            data: observable,
            searchQuery: observable,
            isActive: observable,
            pageNumber: observable,
            rowsPerPage: observable,
            totalItemCount: observable,
            setData: action,
            setSearchQuery: action,
            setIsActive: action,
            setPageNumber: action,
            setRowsPerPage: action,
            setTotalItemCount: action, 
            reset: action,
            absenceRequestFilter: computed
        });
    }

    setData(value){
        this.data = value;
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
        this.pageSize = value;
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    get absenceRequestFilter() {
        const filter = {};

        filter.pageNumber = this.pageNumber;
        filter.pageSize = this.pageSize;
        filter.query = this.query;
        filter.isActive = this.isActive;

        return filter;
    }

    reset() {
        this.rowsPerPage = 10;
        this.pageNumber = 1;
        this.query = '';
        this.isActive = null;
    }
}

const absenceRequestTypesListStore = new AbsenceRequestTypesListStore();
export default absenceRequestTypesListStore;