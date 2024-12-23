import React, { useCallback, useMemo } from "react";
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
import { NoDataMessage } from "../../components/common-ui";
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";


export const CountriesList = observer(() => {
	const { openModal, closeModal } = useModal();
	const [countriesList, setCountriesList] = useState([]);
	const { t } = useTranslation();
	const paginationComponentOptions = PaginationOptions();
	const { signal } = useRequestAbort();
	const[,setSearchParams] = useSearchParams();
	

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

		const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [fetchData]);

		useEffect(() => {
			const disposer = reaction(
				() => ({
					page: countriesSearchStore.page,
					rowsPerPage: countriesSearchStore.rowsPerPage,
					orderBy: countriesSearchStore.orderBy,
				}), 
				() => {
					debouncedFetchData();
				},
				{ fireImmediately: true }
			);
		
			return () => disposer();
		}, [fetchData, debouncedFetchData]);
		

		useEffect(() => {
			setSearchParams(countriesSearchStore.queryParams);
		}, [setSearchParams]);
		

	const handlePageChange = (newPage) => {
		countriesSearchStore.setPage(newPage);
		setSearchParams(countriesSearchStore.queryParams);
	};

	const handleRowsPerChange = (newPageSize) => {
		countriesSearchStore.setPageSize(newPageSize);
		setSearchParams(countriesSearchStore.queryParams);
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
			sortField: 'name'
		},
		{
			name: t('DISPLAY_NAME'),
			selector: row => row.displayName,
			sortable: true,
			sortField: 'displayName'
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
						<FontAwesomeIcon icon={faEdit} />
					</button>
					<button
						type="button"
						onClick={() => onDeleteCountriesClick(row)}
						className="text-red-500 hover:underline p-2"
					>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</div>
			)
		}
	];

	return (
		<div className="flex-1 p-6 bg-gray-100 h-screen">
			<h1 className="h1">{t('COUNTRIES')}</h1>
			<div className="flex flex-col gap-4 sm:flex-row">
				<CountriesSearch fetchData={fetchData}/>
				<button
					type='button'
					onClick={onAddCountriesClick}
					className="btn-common h-10 md:ml-auto"
				>
					{t('ADD_COUNTRY')}
				</button>

			</div>
			<BaseModal />
			<div className="table max-w-full">
				<DataTable
					columns={columns}
					data={countriesList}
					pagination
					paginationServer
					paginationTotalRows={countriesSearchStore.totalItemCount}
					onChangePage={handlePageChange}
					paginationPerPage={countriesSearchStore.rowsPerPage}
					onChangeRowsPerPage={handleRowsPerChange}
					highlightOnHover
					paginationDefaultPage={countriesSearchStore.page}
					persistTableHead={true}
					paginationComponentOptions={paginationComponentOptions}
					noDataComponent={<NoDataMessage />}
					onSort={(column, sortDirection) => {
						const sortField = column.sortField;
						if(sortField) {
							const orderBy = `${sortField}|${sortDirection}`;
							countriesSearchStore.setOrderBy(orderBy);
							setSearchParams(countriesSearchStore.queryParams);
						}
					  }}
					sortServer
				/>
			</div>
		</div>
	);
});