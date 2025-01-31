import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { useRequestAbort } from "../../../components/hooks";
import { usersService } from "../../../services";

export const AbsenceRequestsCalendarSearch = ({ fetchData }) => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUser = useCallback(async () => {
        try {
            const response = await usersService.getUsers(signal);
            const userOptions = response.data.map(user => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`,
            }));
            setUsers(userOptions);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    const handleSearch = () => {
        if (selectedUser)
            fetchData(selectedUser.value);
        else
            fetchData();
    };

    const handleClear = () => {
        setSelectedUser(null);
        fetchData();
    }

    return (
        <div className="grid gap-4 w-full xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 ss:grid-cols-1 mb-5">
            <Select
                options={users}
                onChange={setSelectedUser}
                value={selectedUser}
                placeholder={t('SELECT_USER')}
                isClearable
                isSearchable
                styles={{
                    menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                    }),
                }}
                className="border-gray-300 input-select-border w-full"
            />
            <div className='flex gap-4'>
                <button
                    type="button"
                    className="btn-search"
                    onClick={handleSearch}
                >
                    {t('SEARCH')}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="btn-clear"
                >
                    {t("CLEAR")}
                </button>
            </div>

        </div>
    );
};