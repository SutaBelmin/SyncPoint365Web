//import { makeAutoObservable } from "mobx";
import { action, makeObservable } from "mobx";

class UsersSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    roleId = null;
    isActive = null;
    page = 1;
    pageSize = 10;

    constructor() {
        //makeAutoObservable(this);
        this.initializeQueryParams();

        makeObservable(this, {
            setFilter: action, 
        });
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

    clearFilters() {
        this.setQuery("");
        this.setRoleId(null);
        this.setPage(1);
        this.setIsActive(null);
        this.syncWithQueryParams();
    }


    syncWithQueryParams() {
        const params = new URLSearchParams();

        if (this.searchQuery)
            params.set("searchQuery", this.searchQuery);

        if (this.roleId)
            params.set("roleId", this.roleId);

        if (this.isActive)
            params.set("isActive", this.isActive);

        if (this.page !== 1)
            params.set("page", this.page);

        if (this.pageSize !== 10)
            params.set("pageSize", this.pageSize);

        return params;
    }

    initializeQueryParams() {
        const params = new URLSearchParams(window.location.search);
        // const searchQuery = params.get("searchQuery") || "";
        // const roleId = params.get("roleId") || null;
        // const isActive = params.get("isActive") || null;

        // this.setQuery(searchQuery);
        // this.setRoleId(roleId);
        // this.setIsActive(isActive);

        this.searchQuery = params.get("searchQuery") || "";
        this.roleId = params.get("roleId") || null;
        this.isActive = params.get("isActive") || null;
    }


    get userFilter() {
        return {
            totalItemCount: this.totalItemCount,
            searchQuery: this.searchQuery,
            roleId: this.roleId,
            isActive: this.isActive,
            page: this.page,
            pageSize: this.pageSize
        };
    }

    setFilter(values) {  
        if(values.page)
            this.page = values.page;

        if(values.pageSize)
            this.pageSize = values.pageSize;

        if(values.totalItemCount)
            this.totalItemCount = values.totalItemCount;

        if(values.searchQuery)
            this.searchQuery = values.searchQuery;

        if(values.roleId)
            this.roleId = values.roleId;

        if(values.isActive)
            this.isActive = values.isActive;
    }
}

const usersSearchStore = new UsersSearchStore();
export default usersSearchStore;