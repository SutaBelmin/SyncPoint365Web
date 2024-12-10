import { makeAutoObservable } from 'mobx';

class AbsenceRequestsSearchStore {
    userId = null;
    dateFrom = null;
    dateTo = null;
    absenceRequestStatus = null;
    absenceRequestTypeId = null;
    page = 1;
    pageSize = 10;
    totalItemCount = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setUserId(value) {
        this.userId = value;
        this.syncWithQueryParams();
    }

    setDateFrom(value) {
        this.dateFrom = value;
        this.syncWithQueryParams();
    }

    setDateTo(value) {
        this.dateTo = value;
        this.syncWithQueryParams();
    }

    setAbsenceTypeId(value) {
        this.absenceRequestTypeId = value;
        this.syncWithQueryParams();
    }

    setPage(value) {
        this.page = value;
        this.syncWithQueryParams();
    }

    setPageSize(value) {
        this.pageSize = value;
        this.syncWithQueryParams();
    }

    setTotalItemCount(value) {
        this.totalItemCount = value;
    }

    get absenceRequestsFilter() {
        return {
            absenceRequestTypeId: this.absenceRequestTypeId, 
            userId: this.userId,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo, 
            absenceRequestStatus: this.absenceRequestStatus, 
            page: this.page, 
            pageSize: this.pageSize, 
        };
    }

    reset() {
        this.setAbsenceTypeId(null);
        this.setUserId(null);
        this.dateFrom = null;
        this.dateTo = null;
        this.page = 1;
        this.pageSize = 10;
    }

    syncWithQueryParams(){
        const params = new URLSearchParams();

        if(this.absenceRequestTypeId)
            params.set("absenceRequestTypeId", this.absenceRequestTypeId);

        if(this.userId !== null)
            params.set("userId", this.userId);

        if(this.dateFrom !== null)
            params.set("dateFrom", this.dateFrom);

        if(this.dateTo !== null)
            params.set("dateTo", this.dateTo);

        if(this.page !== 1)
            params.set("page", this.page);

        if(this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        return params;
    }

    initializeQueryParams() {
        const searchParams = new URLSearchParams(window.location.search);
        const absenceRequestTypeId = searchParams.get("absenceRequestTypeId") || null;
        const userId = searchParams.get("userId") || null;
        const dateFrom = searchParams.get("dateFrom") || null;
        const dateTo = searchParams.get("dateTo") || null;
        this.setAbsenceTypeId(absenceRequestTypeId);
        this.setUserId(userId);
        this.setDateFrom(dateFrom);
        this.setDateTo(dateTo);
    }
}

const absenceRequestsSearchStore = new AbsenceRequestsSearchStore();
export default absenceRequestsSearchStore;