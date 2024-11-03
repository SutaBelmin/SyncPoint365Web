import React from 'react';

const UsersList = () => {
    const handleAddUser = () => {
        
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Users</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddUser}
                    className="rounded bg-gray-700 text-white px-4 py-2 hover:bg-gray-600"
                >
                    Add User
                </button>
            </div>
            <div>
                <p>No data available.</p>
            </div>
        </div>
    );
};

export default UsersList;