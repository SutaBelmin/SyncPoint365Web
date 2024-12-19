import { makeObservable, action, observable } from "mobx";
import { userStatusConstant } from "../../../constants";

class UsersSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    roleId = null;
    isActive = null;
    page = 1;
    pageSize = 10;
    orderBy = "";
    currentQueryParams = null;

    constructor() {
        makeObservable(this, {
            setPage: action, 
            setPageSize: action, 
            setTotalItemCount: action,
            setOrderBy: action,
            page: observable,
            pageSize: observable,
            totalItemCount: observable, 
            orderBy: observable
        });

        this.initializeQueryParams();
    }

    setTotalItemCount(count) {
        this.totalItemCount = count;
    }

    setPage(page) {
        this.page = page;
        this.syncWithQueryParams();
    }

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
        this.syncWithQueryParams();
    }

    setQuery(query) {
        this.searchQuery = query;
        this.syncWithQueryParams();
    }

    setRoleId(roleId) {
        this.roleId = roleId;
        this.syncWithQueryParams();
    }

    setIsActive(isActive) {
        this.isActive = isActive;
        this.syncWithQueryParams();
    }

    setOrderBy(orderBy) {
        this.orderBy = orderBy;  
        this.syncWithQueryParams();
    }

    clearFilters() {
        this.setQuery("");
        this.setRoleId(null);
        this.setIsActive(null);
        this.setPage(1);
        this.setOrderBy("");
        this.syncWithQueryParams();
    }

    syncWithQueryParams() {
        const params = new URLSearchParams();

        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if (this.roleId || this.roleId === 0)
            params.set("roleId", this.roleId);

        if (this.isActive !== null)
            params.set("isActive", this.isActive ? userStatusConstant.active : userStatusConstant.inactive);

         if (this.page !== 1)
            params.set("page", this.page);

        if (this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        if(this.totalItemCount !== 0) 
            params.set("totalItemCount", this.totalItemCount);

        if (this.orderBy)  
            params.set("orderBy", this.orderBy);

        this.currentQueryParams = params;
        return params;
    }

    initializeQueryParams() { 
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get("searchQuery") || "";
        const roleId = params.get("roleId") || null;
        const isActive = params.get("isActive") || null;
        const orderBy = params.get("orderBy") || "";
        const page = parseInt(params.get("page")) || 1;
        const pageSize = parseInt(params.get("pageSize")) || 10;
        const totalItemCount = parseInt(params.get("totalItemCount")) || 0;

        this.setQuery(searchQuery);
        this.setRoleId(roleId);
        this.setIsActive(isActive === null ? null : (isActive === userStatusConstant.active));
        this.setOrderBy(orderBy);
        this.setPage(page);
        this.setPageSize(pageSize);
        this.setTotalItemCount(totalItemCount);
    }


    get userFilter() {
        return {
            searchQuery: this.searchQuery,
            roleId: this.roleId,
            isActive: this.isActive,
            totalItemCount: this.totalItemCount,
            page: this.page,
            pageSize: this.pageSize,
            orderBy: this.orderBy
        };
    }

    get queryParams() {
        return this.currentQueryParams;
    }
}

const usersSearchStore = new UsersSearchStore();
export default usersSearchStore;