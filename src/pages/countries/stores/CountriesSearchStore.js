import {action, makeObservable, observable} from 'mobx';


class CountriesStore{
    data = []
    page = 1
    totalItemCount = 0
    rowsPerPage = 10
    searchQuery = ""

    constructor(){
        makeObservable(this, {
            data: observable,
            page: observable,
            totalItemCount: observable,
            rowsPerPage: observable,
            searchQuery: observable,
            setSearchQuery: action,
            setPage: action,
            setRowsPerPage: action,
            setData: action,
            setTotalItemCount: action,
            resetFilters: action
        });
    }

    setSearchQuery(query){
        this.searchQuery = query;
    }

    setPage(page){
        this.page = page;
    }

    setRowsPerPage(rows){
        this.rowsPerPage = rows;
    }

    setData(data){
        this.data = data;
    }

    setTotalItemCount(count){
        this.totalItemCount = count;
    }

  resetFilters() {
    this.searchQuery = "";
    this.page = 1;
    this.rowsPerPage = 10;
  }
}

const countriesSearchStore = new CountriesStore();
export default countriesSearchStore;