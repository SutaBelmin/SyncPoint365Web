import React, { useCallback } from 'react';
import { BaseModal } from '../../components/modal';
import { useEffect, useState } from "react";
import { userService } from '../../services';
import DataTable from 'react-data-table-component';
import './UsersList.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import { NoDataMessage } from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { Formik, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationModal } from '../../components/modal';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context';

export const UsersList = () => {
    const { openModal, closeModal } = useModal();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const response = await userService.getPagedUsers(page, pageSize, signal);
            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }

    }, [page, pageSize, signal, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const onAddUserClick = () => {
        navigate('/usersAdd');
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
            name: t('CITY_NAME'),
            selector: row => row.cityName,
            sortable: true,
        },
        {
            name: t('ROLE'),
            selector: row => row.role,
            sortable: true,
        },
    ];

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

            <Formik>
                <Form className="flex justify-end mb-4 xs:flex-row">
                    <button
                        type='button'
                        onClick={onAddUserClick}
                        className="btn-common h-10 md:ml-auto"
                    >
                        {t('ADD_USER')}
                    </button>
                </Form>
            </Formik>
            <BaseModal />

            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={totalItemCount}
                    onChangePage={(newPage) => {
                        setPage(newPage);
                    }}
                    paginationPerPage={pageSize}
                    onChangeRowsPerPage={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(1);
                    }}
                    highlightOnHover
                    persistTableHead={true}
                    noDataComponent={<NoDataMessage />}
                    paginationComponentOptions={paginationComponentOptions}
                />
            </div>
        </div>
    );
};