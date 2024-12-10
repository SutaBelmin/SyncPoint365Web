import { makeAutoObservable } from "mobx";

class UsersSearchStore {
    totalItemCount = 0;
    searchQuery = "";
    selectedRoleId = null;
    page = 1;
    pageSize = 10;

    constructor() {
        makeAutoObservable(this);
    }

    setTotalItemCount(count) {
        this.totalItemCount = count;
    }

    setPage(page) {
        this.page = page;
    }

    setPageSize(newPageSize) {
        this.pageSize = newPageSize;
    }

    setQuery(query) {
        this.searchQuery = query;
    }

    setRoleId(roleId) {
        this.selectedRoleId = roleId;
    }

    clearFilters() {
        this.setQuery(""); 
        this.setRoleId(null);
        this.setPage(1);
    }

    get userFilter() {
        return {
            totalItemCount: this.totalItemCount,
            searchQuery: this.searchQuery,
            roleId: this.selectedRoleId,
            page: this.page,
            pageSize: this.pageSize
        };
    }
}

const usersSearchStore = new UsersSearchStore();
export default usersSearchStore;