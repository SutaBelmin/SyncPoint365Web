import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity, faEarthAmerica, faHome, faUser, faUserTimes } from '@fortawesome/free-solid-svg-icons';

const SideNavbar = () => {
    return (
        <nav className="bg-gray-800 text-white w-64 h-screen p-4 fixed">
            <h1 className="text-xl font-semibold mb-8">SyncPoint365</h1>
            <ul className="space-y-4">
                <li className="flex items-center hover:bg-gray-800 py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faHome} className="mr-3" />
                    <a href="/home" className="text-lg">Home</a>
                </li>
                <li className="flex items-center hover:bg-gray-800 py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faUser} className="mr-3" />
                    <a href="/users" className="text-lg">Users</a>
                </li>
                <li className="flex items-center hover:bg-gray-800 py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faEarthAmerica} className="mr-3" />
                    <a href="/countries" className="text-lg">Countries</a>
                </li>
                <li className="flex items-center hover:bg-gray-800 py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faCity} className="mr-3" />
                    <a href="/cities" className="text-lg">Cities</a>
                </li>
                <li className="flex items-center hover:bg-gray-800 py-2 px-4 rounded">
                    <FontAwesomeIcon icon={faUserTimes} className="mr-3" />
                    <a href="/absenceRequestTypes" className="text-lg">Request Types</a>
                </li>
            </ul>
        </nav>
    );
};

export default SideNavbar;