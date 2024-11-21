import React, { useEffect, useCallback } from "react";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CountriesAdd, CountriesEdit } from "../countries";
import { countriesService } from "../../services";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CountriesSearch } from "./search/CountriesSearch";
import { observer } from "mobx-react";
import countriesSearchStore from "./stores/CountriesSearchStore";

export const CountriesList = observer(() => {
  const { openModal, closeModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      const response = await countriesService.getPagedList(
        countriesSearchStore.page,
        countriesSearchStore.rowsPerPage,
        countriesSearchStore.searchQuery
      );
      const responseData = response.data?.items || response.data;
      countriesSearchStore.setData(responseData);
      countriesSearchStore.setTotalItemCount(response.data.totalItemCount);
    } catch (error) {
      toast.error("There was an error. Please contact administrator.");
    }
  }, [countriesSearchStore.page, countriesSearchStore.rowsPerPage, countriesSearchStore.searchQuery]);
  
  useEffect(() => {
    fetchData(); 
  }, [fetchData]);


  const handlePageChange = (newPage) => {
    countriesSearchStore.setPage(newPage);
  };

  const handleRowsPerChange = (newRowsPerPage) => {
    countriesSearchStore.setRowsPerPage(newRowsPerPage);
    countriesSearchStore.setPage(1); 
  };

  const onSearch = (params) => {
    fetchData();
    countriesSearchStore.setSearchQuery(params.searchQuery);
    countriesSearchStore.setPage(1);
  };

  const clearFilters = () => {
    countriesSearchStore.resetFilters();
  };

  const customNoDataComponent = (
    <div className="no-data-message">
      No requests available.
    </div>
  );

  const onAddCountriesClick = () => {
    openModal(<CountriesAdd closeModal={closeModal} fetchData={fetchData} />);
  };

  const onEditCountriesClick = (country) => {
    openModal(<CountriesEdit country={country} closeModal={closeModal} fetchData={fetchData} />);
  };

  const onDeleteCountriesClick = (country) => {
    openModal(
      <DeleteConfirmationModal
        entityName={country.name}
        onDelete={() => handleDelete(country.id)}
        onCancel={closeModal}
      />
    );
  };

  const handleDelete = async (countryId) => {
    try {
      await countriesService.delete(countryId);
      fetchData();
      closeModal();
      toast.success("Country deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete country. Please try again.");
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Display Name',
      selector: row => row.displayName,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button type="button" onClick={() => onEditCountriesClick(row)} className="text-blue-500 hover:underline p-2">
            <FontAwesomeIcon icon={faEdit} className="mr-3" />
          </button>
          <button type="button" onClick={() => onDeleteCountriesClick(row)} className="text-red-500 hover:underline p-2">
            <FontAwesomeIcon icon={faTrash} className="mr-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Countries</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <CountriesSearch
            onSearch={onSearch}
            onClearFilters={clearFilters}
            initialSearchTerm={countriesSearchStore.searchQuery}
          />
        </div>
        
        <button
          type="button"
          onClick={onAddCountriesClick}
          className="btn-new"
        >
          Add Country
        </button>
      </div>
  
      <BaseModal />
  
      <DataTable
        columns={columns}
        data={countriesSearchStore.data}
        pagination
        paginationServer
        paginationTotalRows={countriesSearchStore.totalItemCount}
        onChangePage={handlePageChange}
        paginationPerPage={countriesSearchStore.rowsPerPage}
        onChangeRowsPerPage={handleRowsPerChange}
        highlightOnHover
        persistTableHead={true}
        noDataComponent={customNoDataComponent}
      />
    </div>
  );
});
