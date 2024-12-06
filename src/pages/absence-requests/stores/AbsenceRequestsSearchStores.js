import { makeAutoObservable } from 'mobx';

class AbsenceRequestsSearchStore {
    userId = null;
    dateFrom = null;
    dateTo = null;
    dateReturn = null;
    absenceRequestStatus = null;
    absenceTypeId = null;
    comment = null;
    pageNumber = 1;
    pageSize = 10;
    totalItemCount = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setUserId(value) {
        this.userId = value;
    }

    setDateFrom(value) {
        this.dateFrom = value;
    }

    setDateTo(value) {
        this.dateTo = value;
    }
    setDateReturn(value) {
        this.dateReturn = value;
    }

    setAbsenceRequestStatus(value) {
        this.absenceRequestStatus = value;
    }
    setAbsenceTypeId(value) {
        this.absenceTypeId = value;
    }
    
    setComment(value) {
        this.comment = value;
    }

    setPageNumber(value) {
        this.pageNumber = value;
    }

    setPageSize(value) {
        this.pageSize = value;
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    get absenceRequestsFilter() {
        return {
            userId: this.userId,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo, 
            dateReturn: this.dateReturn, 
            absenceRequestStatus: this.absenceRequestStatus, 
            absenceTypeId: this.absenceTypeId, 
            comment: this.comment, 
            pageNumber: this.pageNumber, 
            pageSize: this.pageSize, 
            totalItemCount: this.totalItemCount,
        };
    }

    reset() {
        this.userId = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.dateReturn = null;
        this.absenceRequestStatus = null;
        this.absenceTypeId = null;
        this.comment = null;
        this.pageNumber = 1;
        this.pageSize = 10;
        this.totalItemCount = 0;
    }
}

const absenceRequestsSearchStore = new AbsenceRequestsSearchStore();
export default absenceRequestsSearchStore;