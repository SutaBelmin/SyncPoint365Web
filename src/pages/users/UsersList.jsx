import React from 'react';
import { BaseModal } from '../../components/modal';
import { useModal } from '../../context/ModalProvider';
import { UsersAdd } from '../users'

import { useEffect, useState } from "react";
import { userService } from '../../services';

const UsersList = () => {
    const { openModal } = useModal();

    const [data, setData] = useState([]);

     // Define an async function inside useEffect
     const fetchUsers = async () => {
        try {
            console.log("service",userService);
            const response = await userService.getUsers();
            setData(response.data);  // Assuming response.data contains the user list
            console.log("response",response);
            console.log("data",data);
            
        } catch (error) {
            console.error("Error fetching users:", error);
           
        }
    };

    useEffect(() => {
        fetchUsers();
        /* userService.getUsers()
            .then(response => {
                setData(response.data);  
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });*/
    }, []);  

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
            
            {/* 
            <div>
                <p>No data available.</p>
            </div>*/}

             
             <div>
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">First Name</th>
                            <th className="border px-4 py-2">Last Name</th>
                            <th className="border px-4 py-2">Full Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((user, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{user.firstName}</td>
                                    <td className="border px-4 py-2">{user.lastName}</td>
                                    <td className="border px-4 py-2">{user.fullName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-center">
                                    No users available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default UsersList;