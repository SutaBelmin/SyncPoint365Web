import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseModal } from '../../components/modal';
import { observer } from "mobx-react";
import { reaction } from "mobx";
import { useModal } from '../../context';
import { PaginationOptions } from "../../components/common-ui/PaginationOptions";
import { NoDataMessage } from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { faCircleCheck, faCircleXmark, faEdit, faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationModal } from '../../components/modal';
import { UsersSearch } from './search/UsersSearch';
import { usersSearchStore } from './stores';
import { usersService } from '../../services';
import './UsersList.css';
import { roleConstant } from '../../constants';
import { UsersPreview } from './UsersPreview';
import { UsersChangePassword } from './UsersChangePassword';

export const UsersList = observer(() => {
    const { openModal, closeModal } = useModal();
    const [data, setData] = useState([]);

    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();
    const navigate = useNavigate();
    const [resetSort, setResetSort] = useState(false);

    const resetSorting = () => {
        setResetSort(true); 
        usersSearchStore.setOrderBy("");
        usersSearchStore.setPage(1);
    };

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...usersSearchStore.userFilter };

            const response = await usersService.getPagedUsersFilter(filter, signal);

            setData(response.data.items);
            usersSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }

    }, [signal, t]);

    const onPreviewUserClick = (user) => {
        openModal(
            <UsersPreview user={user} closeModal={closeModal} />
        );
    };

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: usersSearchStore.page,
                pageSize: usersSearchStore.pageSize
            }),
            () => {
                fetchData();
            },
            {
                fireImmediately: true
            }
        );

        return () => disposeReaction();
    }, [fetchData]);

    const onAddUserClick = () => {
        navigate('add');
    };

    const columns = [
        {
            name: t('FIRST_NAME'),
            selector: row => row.firstName,
            sortable: true,
            sortField: 'firstName'
        },
        {
            name: t('LAST_NAME'),
            selector: row => row.lastName,
            sortable: true,
            sortField: 'lastName'
        },
        {
            name: t('CITY'),
            selector: row => row.cityName,
            sortable: false,
        },
        {
            name: t('ADDRESS'),
            selector: row => row.address,
            sortable: false,
        },
        {
            name: t('PHONE'),
            selector: row => row.phone,
            sortable: false,
        },
        {
            name: t('ROLE'),
            selector: row => {
                return row.role === roleConstant.superAdministrator ? t('SUPER_ADMINISTRATOR') :
                    row.role === roleConstant.administrator ? t('ADMINISTRATOR') :
                        row.role === roleConstant.employee ? t('EMPLOYEE') : t(row.role);
            },
            sortable: false,
        },
        {
            name: t('STATUS'),
            selector: row => row.isActive ? t('ACTIVE') : t('INACTIVE'),
            sortable: false,
        },
        {
            name: t('ACTIONS'),
            cell: (row) => (
                <div className="flex">
                    <button
                        onClick={() => navigateToEdit(row.id)}
                        className="text-xl text-blue-500 hover:underline p-2"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={() => statusChange(row.id, row.isActive)}
                        className={`text-xl pr-2 ${row.isActive ? 'text-red-500' : 'text-green-500'}`}
                    >
                        {row.isActive ? (
                            <FontAwesomeIcon icon={faCircleXmark} />
                        ) : (
                            <FontAwesomeIcon icon={faCircleCheck} />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => onPreviewUserClick(row)}
                        className="text-blue-500 hover:underline p-2"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                        onClick={() => changePasswordClick(row.id)}
                        className={'text-xl text-gray-250'}
                    >
                        {(
                            <FontAwesomeIcon icon={faLock} />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    const navigateToEdit = (userId) => {
        navigate(`/users/update/${userId}`);
    }

    const statusChange = (userId, isActive) => {
        openModal(
            <ConfirmationModal
                title={isActive ? t('DEACTIVATE') : t('ACTIVATE')}
                onConfirm={() => handleStatusChange(userId)}
                onCancel={closeModal}
            />
        );
    };

    const changePasswordClick = (userId) => {
        openModal(
            <UsersChangePassword
                userId={userId}
                onCancel={closeModal}
                fetchData={fetchData}
                closeModal={closeModal}
            />
        );
    };

    const handleStatusChange = async (userId) => {
        try {
            await usersService.updateUserStatus(userId);
            fetchData();
            toast.success(t('UPDATED'));
            closeModal();
        } catch (error) {
            toast.error(t('FAIL_UPDATE'));
        }
    }

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <h1 className="h1">{t('USERS')}</h1>

            <div className="flex flex-col gap-4 xs:flex-row">
                <UsersSearch fetchData={fetchData} resetSorting={resetSorting} />
            </div>

            <div className="flex justify-end mt-4">
                <button
                    type='button'
                    onClick={onAddUserClick}
                    className="btn-common h-10"
                >
                    {t('ADD_USER')}
                </button>
            </div>
            <BaseModal />

            <div className="table max-w-full">
                <DataTable
                    key={resetSort}
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={usersSearchStore.totalItemCount}
                    onChangePage={(newPage) => {
                        usersSearchStore.setPage(newPage);
                    }}
                    paginationPerPage={usersSearchStore.pageSize}
                    onChangeRowsPerPage={(newPageSize) => {
                        usersSearchStore.setPageSize(newPageSize);
                        usersSearchStore.setPage(1);
                    }}
                    highlightOnHover
                    persistTableHead={true}
                    noDataComponent={<NoDataMessage />}
                    paginationComponentOptions={paginationComponentOptions}
                    onRowClicked={(row) => onPreviewUserClick(row)}
                    onSort={(column, sortDirection) => {
                        const sortField = column.sortField;
                        if (sortField) {
                            const orderBy = `${sortField}|${sortDirection}`;

                            usersSearchStore.setOrderBy(orderBy);
                            usersSearchStore.setPage(1);

                            const params = usersSearchStore.syncWithQueryParams();
                            params.set("orderBy", orderBy); 

                            const newUrl = `${window.location.pathname}?${params.toString()}`;
                            window.history.pushState({}, "", newUrl);

                            fetchData();
                        }
                    }}
                />
            </div>
        </div>
    );
}); 