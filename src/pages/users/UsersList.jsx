import React, { useCallback } from 'react';
import { BaseModal } from '../../components/modal';
import { useModal } from '../../context/ModalProvider';
import { UsersAdd } from '../users'
import { useEffect, useState } from "react";
import { userService } from '../../services';
import DataTable from 'react-data-table-component';
import './UsersList.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import {NoDataMessage} from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";

export const UsersList = () => {
    const { openModal } = useModal();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();

    const fetchData = useCallback(async () => {
        try { 
            const response = await userService.getPagedUsers(page, signal);
            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);

        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }

    }, [page, signal, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const onAddUserClick = () => {
        openModal(<UsersAdd />);
    };

    const columns = [
        {
            name: t('FIRST_NAME'),
            selector: row => row.firstName,
            sortable: true,
        },
        {
            name: t('LAST_NAME'),
            selector: row => row.lastName,
            sortable: true,
        },
        {
            name: t('FULL_NAME'),
            selector: row => row.fullName,
            sortable: true,
        },
    ];


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{t('USERS')}</h1>
            <div className="flex justify-end mb-4">
                <button
                    type='button'
                    onClick={onAddUserClick}
                    className="btn-new"
                >
                    {t('ADD_USER')}
                </button>
            </div>
            <BaseModal />

            <DataTable
                columns={columns}
                data={data || []}
                pagination
                paginationServer
                paginationTotalRows={totalItemCount}
                onChangePage={handlePageChange}
                highlightOnHover
                persistTableHead={true}
                noDataComponent={<NoDataMessage />}
                paginationComponentOptions={paginationComponentOptions}
            />
        </div>
    );
};
