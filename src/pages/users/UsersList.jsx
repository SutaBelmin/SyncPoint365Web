import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseModal } from '../../components/modal';
import { observer } from "mobx-react";
import { reaction } from "mobx";
import { useModal } from '../../context';
import { useAuth } from '../../context/AuthProvider';
import { NoDataMessage } from "../../components/common-ui";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { faEdit, faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { UsersSearch } from './search/UsersSearch';
import { usersSearchStore } from './stores';
import { usersService } from '../../services';
import { UsersPreview } from './UsersPreview';
import { UsersChangePassword } from './UsersChangePassword';
import './UsersList.css';
import debounce from 'lodash.debounce';
import { formatPhoneNumber, PaginationOptions } from '../../utils';
import { UsersStatusChange } from './UsersStatusChange';
import { roleConstant } from '../../constants';

export const UsersList = observer(() => {
    const { openModal, closeModal } = useModal();
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const paginationComponentOptions = PaginationOptions();
    const { signal } = useRequestAbort();
    const navigate = useNavigate();
    const [, setSearchParams] = useSearchParams();
    const { loggedUser } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const filter = {
                ...usersSearchStore.userFilter
            };
            const response = await usersService.getPagedUsersFilter(filter, signal);
            setData(response.data.items);
            usersSearchStore.setTotalItemCount(response.data.totalItemCount);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }

    }, [signal, t]);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 100), [fetchData]);

    useEffect(() => {
        const disposeReaction = reaction(
            () => ({
                page: usersSearchStore.page,
                pageSize: usersSearchStore.pageSize,
                orderBy: usersSearchStore.orderBy
            }),
            () => {
                debouncedFetchData();
            },
            {
                fireImmediately: true
            }
        );
        return () => disposeReaction();
    }, [debouncedFetchData]);

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
            name: t('ROLE'),
            selector: row => {
                return row.role === roleConstant.superAdministrator ? t('SUPER_ADMINISTRATOR') :
                    row.role === roleConstant.administrator ? t('ADMINISTRATOR') :
                        row.role === roleConstant.employee ? t('EMPLOYEE') : t(row.role);
            },
            sortable: false,
        },
        {
            name: t('EMAIL'),
            selector: row => row.email,
            sortable: false,
        },
        {
            name: t('PHONE'),
            selector: row => formatPhoneNumber(row.phone),
            sortable: false,
        },
        {
            name: t('STATUS'),
            cell: (row) => (
                    <button
                        onClick={() => changeStatus(row)}
                        disabled={row.id === loggedUser.id}
                         className={`relative inline-flex items-center h-6 rounded-full w-10 ${
                             row.id === loggedUser.id ? "bg-gray-300 cursor-not-allowed"  : row.isActive ? "bg-green-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${row.isActive ? "translate-x-5" : "translate-x-1"
                                }`}
                        ></span>
                    </button>
            ),
            sortable: false,
        },
        {
            name: t('ACTIONS'),
            cell: (row) => (
                <div className="flex">
                    <button
                        onClick={() => navigateToEdit(row.id)}
                        className="text-lg text-blue-500 hover:underline p-2"
                    >
                        <FontAwesomeIcon icon={faEdit} style={{ color: '#276EEC' }} />
                    </button>
                    <button
                        onClick={() => changePasswordClick(row.id)}
                        className={'text-lg text-gray-400'}
                    >
                        {(
                            <FontAwesomeIcon icon={faLock} />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => onPreviewUserClick(row.id)}
                        className="text-lg text-blue-500 hover:underline p-2"
                        style={{ color: '#276EEC' }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>

                </div>
            ),
        },
    ];

    const navigateToEdit = (userId) => {
        navigate(`/users/update/${userId}`);
    }

    const onPreviewUserClick = (userId) => {
        openModal(
            <UsersPreview userId={userId} closeModal={closeModal} />
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

    const changeStatus = (user) => {
        openModal(
            <UsersStatusChange
                title={user.isActive ? t('DEACTIVATE_USER') : t('ACTIVATE_USER')}
                user={user}
                fetchData={fetchData}
                closeModal={closeModal}
            />
        );
    }

    return (
        <div className="flex-1 p-6 max-w-full bg-gray-100 h-screen">
            <div className="flex justify-between items-center">
                <h1 className="h1">{t('USERS')}</h1>

                <div className="flex justify-end mt-4 pt-14 pb-4">
                    <button
                        type='button'
                        onClick={onAddUserClick}
                        className="btn-common h-10"
                    >
                        {t('ADD_USER')}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row">
                <UsersSearch fetchData={fetchData} />
            </div>

            <BaseModal />

            <div className="table max-w-full">
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationServer
                    paginationTotalRows={usersSearchStore.totalItemCount}
                    paginationDefaultPage={usersSearchStore.page}
                    onChangePage={(newPage) => {
                        usersSearchStore.setPage(newPage);
                        setSearchParams(usersSearchStore.queryParams);
                    }}
                    paginationPerPage={usersSearchStore.pageSize}
                    onChangeRowsPerPage={(newPageSize) => {
                        usersSearchStore.setPageSize(newPageSize);
                        setSearchParams(usersSearchStore.queryParams);
                    }}
                    highlightOnHover
                    persistTableHead={true}
                    noDataComponent={<NoDataMessage />}
                    paginationComponentOptions={paginationComponentOptions}
                    onRowDoubleClicked={(row) => onPreviewUserClick(row.id)}
                    onSort={(column, sortDirection) => {
                        const sortField = column.sortField;
                        if (sortField) {
                            const orderBy = `${sortField}|${sortDirection}`;
                            usersSearchStore.setOrderBy(orderBy);
                            setSearchParams(usersSearchStore.queryParams);
                        }
                    }}
                    sortServer={true}
                />
            </div>
        </div>
    );
}); 