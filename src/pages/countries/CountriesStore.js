import {action, makeObservable, observable} from 'mobx';
import { countriesService } from '../../services';
import { toast } from "react-toastify";

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
            fetchData: action,
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

    async fetchData() {
        try {
            const response = await countriesService.getPagedList(
                this.page,
                this.rowsPerPage,
                this.searchQuery,
              );
      const responseData = response.data?.items || response.data;
      this.setData(responseData);
      this.setTotalItemCount(response.data.totalItemCount);
    } catch (error) {
      toast.error("There was an error. Please contact administrator.");
    }
  }

  resetFilters() {
    this.searchQuery = "";
    this.page = 1;
    this.rowsPerPage = 10;
  }
}

const countriesStore = new CountriesStore();
export default countriesStore;