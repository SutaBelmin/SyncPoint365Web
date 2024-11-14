import React from 'react';
import { BaseModal } from '../../components/modal';
import { useModal } from '../../context/ModalProvider';
import { UsersAdd } from '../users'

import { useEffect, useState } from "react";
import { userService } from '../../services';
import DataTable from 'react-data-table-component';
import './UsersList.css';

const UsersList = () => {
    const { openModal } = useModal();

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await userService.getUsers();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Users</h1>
            <div className="flex justify-end mb-4">
                <button
                    type='button'
                    onClick={onAddUserClick}
                    className="rounded bg-gray-700 text-white px-4 py-2 hover:bg-gray-600"
                >
                    Add User
                </button>
            </div>
            <BaseModal />

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                noDataComponent="No users available." />
        </div>
    );
};

export default UsersList;