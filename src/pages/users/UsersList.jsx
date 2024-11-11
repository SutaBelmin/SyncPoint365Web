import React from 'react';
import { BaseModal } from '../../components/modal';
import { useModal } from '../../context/ModalProvider';
import { UsersAdd } from '../users'

const UsersList = () => {
    const { openModal } = useModal();

  const onAddUserClick = () => {
    openModal(<UsersAdd />);
  };

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
            <div>
                <p>No data available.</p>
            </div>
        </div>
    );
};

export default UsersList;