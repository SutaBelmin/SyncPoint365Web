import { makeObservable, action, observable } from "mobx";

class AbsenceRequestsSearchStore {
    totalItemCount = 0;
    userId = null;
    absenceRequestTypeId = null;
    absenceRequestStatusId = null;
    dateFrom = null;
    dateTo = null;
    page = 1;
    pageSize = 10;


    constructor(){
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

    setAbsenceTypeId(value) {
        this.absenceRequestTypeId = value;
        this.syncWithQueryParams();
    }

    setUserId(value) {
        this.userId = value;
        this.syncWithQueryParams();
    }

    
    setAbsenceRequestStatusId(value) {
        this.absenceRequestStatusId = value;
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

    clearFilters() {
        this.setAbsenceTypeId(null);
        this.setUserId(null);
        this.setAbsenceRequestStatusId(null);
        this.setDateFrom(null);
        this.setDateTo(null);
        this.setPage(1);
        this.syncWithQueryParams();
    }

    syncWithQueryParams(){
        const params = new URLSearchParams();

        if(this.absenceRequestTypeId)
            params.set("absenceRequestTypeId", this.absenceRequestTypeId);

        if(this.userId)
            params.set("userId", this.userId);

        if(this.absenceRequestStatusId || this.absenceRequestStatusId === 0)
            params.set("absenceRequestStatusId", this.absenceRequestStatusId)

        if(this.dateFrom)
            params.set("dateFrom", this.dateFrom);

        if(this.dateTo)
            params.set("dateTo", this.dateTo);

        if(this.page !== 1)
            params.set("page", this.page);

        if(this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const absenceRequestTypeId = params.get("absenceRequestTypeId") || null;
        const userId = params.get("userId") || null;
        const absenceRequestStatusId = params.get("absenceRequestStatusId") || null;
        const dateFrom = params.get("dateFrom") || null;
        const dateTo = params.get("dateTo") || null;
        this.setAbsenceTypeId(absenceRequestTypeId);
        this.setUserId(userId);
        this.setAbsenceRequestStatusId(absenceRequestStatusId);
        this.setDateFrom(dateFrom);
        this.setDateTo(dateTo);
    }

    get absenceRequestFilter() {
        return {
            absenceRequestTypeId: this.absenceRequestTypeId, 
            absenceRequestStatusId: this.absenceRequestStatusId, 
            userId: this.userId,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo, 
            page: this.page, 
            pageSize: this.pageSize, 

        };

    }
}

const absenceRequestsSearchStore = new AbsenceRequestsSearchStore();
export default absenceRequestsSearchStore;