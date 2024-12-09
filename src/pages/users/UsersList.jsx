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
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import { ConfirmationModal } from '../../components/modal';

export const UsersList = () => {
    const { openModal, closeModal } = useModal();
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
        {
            name: t('ACTIONS'),
        cell: (row) => (
            <div className="flex justify-center items-center w-10">
                <button
                    onClick={() => statusChange(row.id, row.isActive)}
                    className={`text-xl ${row.isActive ? 'text-green-500' : 'text-red-500'}`}
                >
                    {row.isActive ? (
                         <FontAwesomeIcon icon={faCircleCheck} />
                    ) : (
                        <FontAwesomeIcon icon={faCircleXmark} />
                    )}
                </button>
            </div>
        ),
        },
    ];

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const statusChange = (userId, isActive) => {
        openModal(
            <ConfirmationModal
                title={isActive ? t('DEACTIVATE') : t('ACTIVATE')}
                onConfirm={() => handleStatusChange(userId)}
                onCancel={closeModal}
            />
        );
    };

    const handleStatusChange = async (userId) => {
        try {
            await userService.updateUserStatus(userId);
            fetchData();
            toast.success(t('UPDATED'));
            closeModal();
        } catch (error) {
            toast.error(t('FAIL_UPDATE'));
        }
    };

    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <h1 className="h1">{t('USERS')}</h1>
            <div>
                <Formik>
                    <Form className="flex flex-col gap-4 w-full xs:flex-row">
                        <Field
                            name="searchQuery"
                            type="text"
                            placeholder="Search absence request types"
                            className="input-search h-10 rounded-md border-gray-300 max-w-[25rem] w-full"
                            autoComplete="off"
                        />
                        <button
                            type='button'
                            onClick={onAddUserClick}
                            className="btn-common h-10 md:ml-auto"
                        >
                            {t('ADD_USER')}
                        </button>
                    </Form>
                </Formik>
            </div>

            <BaseModal />
            <div className="table max-w-full">
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
        </div>
    );
};