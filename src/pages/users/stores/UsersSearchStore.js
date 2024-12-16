import { makeObservable, action, observable } from "mobx";
import { userStatusConstant } from "../../../constants";

class UsersSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    roleId = null;
    isActive = null;
    page = 1;
    pageSize = 10;

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
        this.setIsActive(null);
        this.setPage(1);
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

        return params;
    }

    initializeQueryParams() { 
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get("searchQuery") || "";
        const roleId = params.get("roleId") || null;
        const isActive = params.get("isActive") || null;

        this.setQuery(searchQuery);
        this.setRoleId(roleId);
        this.setIsActive(isActive === null ? null : (isActive === 'active'));
    }


    get userFilter() {
        return {
            searchQuery: this.searchQuery,
            roleId: this.roleId,
            isActive: this.isActive,
            totalItemCount: this.totalItemCount,
            page: this.page,
            pageSize: this.pageSize
        };
    }
}

const usersSearchStore = new UsersSearchStore();
export default usersSearchStore;