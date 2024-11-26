import React, { useCallback } from "react";
import { BaseModal, DeleteConfirmationModal } from "../../components/modal";
import { useModal } from "../../context/ModalProvider";
import { CountriesAdd, CountriesEdit } from "../countries"
import { countriesService } from "../../services";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CountriesSearch } from "./search/CountriesSearch";
import { observer } from "mobx-react";
import countriesSearchStore from "./stores/CountriesSearchStore";
import { reaction } from "mobx";
import { useTranslation } from 'react-i18next';
import {NoDataMessage} from "../../components/common-ui";
import {PaginationOptions} from "../../components/common-ui/PaginationOptions";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";

export const CountriesList = observer(() => {
  const { openModal, closeModal } = useModal();
  const [countriesList, setCountriesList] = useState([]);
  const { t } = useTranslation();
  const paginationComponentOptions = PaginationOptions(); 
  const { signal } = useRequestAbort();

  const fetchData = useCallback(
    async () => {
      try { 
        const filters = countriesSearchStore.countryFilter;
        const response = await countriesService.getPagedList(filters, signal);
        setCountriesList(response.data?.items);
        countriesSearchStore.setTotalItemCount(response.data.totalItemCount);
      } catch (error) {
        toast.error(t('ERROR_CONTACT_ADMIN'));
      }
    }, [signal, t]);

  useEffect(() => {
    const disposer = reaction(
      () => ({
        filter: countriesSearchStore.countryFilter,
      }),
      () => {
        fetchData();
      },
      {
        fireImmediately: true,
      }
    );
    return () => disposer();
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    countriesSearchStore.setPage(newPage);
  };

  const handleRowsPerChange = (newPageSize) => {
    countriesSearchStore.setPageSize(newPageSize);
    countriesSearchStore.setPage(1);
  };

  const onAddCountriesClick = () => {
    openModal(<CountriesAdd closeModal={closeModal} fetchData={fetchData} />);
  };

  const onEditCountriesClick = (country) => {
    openModal(
      <CountriesEdit country={country} closeModal={closeModal} fetchData={fetchData} />
    );
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
      toast.success(t('DELETED'));
    } catch (error) {
      toast.error(t('FAILED_TO_DELETE'));
    }
  };

  const columns = [
    {
      name: t('NAME'),
      selector: row => row.name,
      sortable: true,
    },
    {
      name: t('DISPLAY_NAME'),
      selector: row => row.displayName,
      sortable: true,
    },
    {
      name: t('ACTIONS'),
      cell: (row) => (
        <div className="flex">
          <button
            type="button"
            onClick={() => onEditCountriesClick(row)}
            className="text-blue-500 hover:underline p-2"
          >
            <FontAwesomeIcon icon={faEdit}/>
          </button>
          <button
            type="button"
            onClick={() => onDeleteCountriesClick(row)}
            className="text-red-500 hover:underline p-2"
          >
            <FontAwesomeIcon icon={faTrash}/>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="pt-16">
      <h1 className="text-xl font-bold mb-4">{t('COUNTRIES')}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <CountriesSearch />
        </div>
        <button
          type='button'
          onClick={onAddCountriesClick}
          className="btn-new"
        >
          {t('ADD_COUNTRY')}
        </button>
      </div>
      <BaseModal />

      <DataTable
        columns={columns}
        data={countriesList}
        pagination
        paginationServer
        paginationTotalRows={countriesSearchStore.totalItemCount}
        onChangePage={handlePageChange}
        paginationPerPage={countriesSearchStore.pageSize}
        onChangeRowsPerPage={handleRowsPerChange}
        highlightOnHover
        persistTableHead={true}
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent={<NoDataMessage />}
      />
    </div>
  );
});










