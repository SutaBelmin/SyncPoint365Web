import React from 'react';
import { BaseModal } from '../../components/modal';
import { useModal } from '../../context/ModalProvider';
import { UsersAdd } from '../users'
import { useEffect, useState } from "react";
import { userService } from '../../services';
import DataTable from 'react-data-table-component';
import './UsersList.css';

export const UsersList = () => {
    const { openModal } = useModal();

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);

    const fetchData = async () => {
        try {
            const response = await userService.getPagedUsers(page);
            console.log("API Response:", response);

            setData(response.data.items);
            setTotalItemCount(response.data.totalItemCount);
            console.log("Set data:", response.data);

        } catch (error) {
            
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [page]);
    

    const onAddUserClick = () => {
        openModal(<UsersAdd />);
    };

    const columns = [
        {
            name: 'First Name',
            selector: row => row.firstName,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.lastName,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => row.fullName,
            sortable: true,
        },
    ];


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Users</h1>
            <div className="flex justify-end mb-4">
                <button
                    type='button'
                    onClick={onAddUserClick}
                    className="btn-new"
                >
                    Add User
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
                noDataComponent="No users available."
            />
        </div>
    );
};
