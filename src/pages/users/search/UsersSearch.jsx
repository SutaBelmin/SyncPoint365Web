import React, { useCallback, useEffect, useState } from 'react';
import Select from "react-select";
import { useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { Formik, Form, Field } from "formik";
import usersSearchStore from "../stores/UsersSearchStore";
import { enumsService } from "../../../services";
import { userStatusConstant, roleConstant } from '../../../constants';
import { useRequestAbort } from "../../../components/hooks/useRequestAbort";
import { useAuth } from '../../../context/AuthProvider';

export const UsersSearch = ({ fetchData }) => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const [roles, setRoles] = useState([]);
    const [userStatusOptions, setUserStatusOptions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const { loggedUser } = useAuth();

    const fetchRoles = useCallback(async () => {
        try {
            const response = await enumsService.getRoles(signal);
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label === roleConstant.superAdministrator ? t('SUPER_ADMINISTRATOR') :
                    role.label === roleConstant.administrator ? t('ADMINISTRATOR') :
                        role.label === roleConstant.employee ? t('EMPLOYEE') : role.label
            }));
            setRoles(rolesOptions);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchRoles();

        setUserStatusOptions([
            { value: userStatusConstant.all, label: t('ALL') },
            { value: userStatusConstant.active, label: t('ACTIVE') },
            { value: userStatusConstant.inactive, label: t('INACTIVE') },
        ]);

    }, [fetchRoles, t]);

    useEffect(() => {
        usersSearchStore.initializeQueryParams(location.search)
        setSearchParams(usersSearchStore.queryParams);
    }, [setSearchParams, location.search]);


    const handleSearch = (values) => {
        usersSearchStore.setQuery(values.searchQuery);
        usersSearchStore.setRoleId(values.roleId);
        usersSearchStore.setIsActive(values.isActive.value === userStatusConstant.all ? null : (values.isActive.value === userStatusConstant.active));

        const queryParams = usersSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);
        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue("searchQuery", "");
        setFieldValue("roleId", null);
        setFieldValue('isActive', userStatusOptions[0]);
        usersSearchStore.clearFilters();
        fetchData();
    };

    const initialValues = {
        searchQuery: usersSearchStore.searchQuery,
        roleId: (() => {
            const roleIdFromParams = searchParams.get("roleId");
            if (roleIdFromParams) {
                const parsedRoleId = parseInt(roleIdFromParams);
                usersSearchStore.setRoleId(parsedRoleId)
                return parsedRoleId;
            }
            return usersSearchStore.roleId;
        })(),
        isActive: userStatusOptions.find((option) => option.value === searchParams.get('isActive')) || userStatusOptions[0],
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSearch}
        >
            {({ setFieldValue, values }) => (
                <Form className="grid gap-4 w-full lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 ss:grid-cols-1">
                    <Field
                        type="text"
                        name="searchQuery"
                        placeholder={t('SEARCH_PLACEHOLDER')}
                        autoComplete="off"
                        className="input-search h-10 rounded-md border-gray-300 input-select-width"
                    />

                    {loggedUser.role === roleConstant.superAdministrator && 
                    <Select
                        id="roleId"
                        name="roleId"
                        value={roles.find(role => role.value === values.roleId) || null}
                        onChange={(option) => setFieldValue('roleId', option && option.value)}
                        options={roles}
                        placeholder={t('SELECT_ROLE')}
                        isClearable
                        isSearchable
                        className='input-select-border input-select-width'
                    />
                    }

                    <Select
                        id="isActive"
                        name="isActive"
                        value={values.isActive}
                        onChange={(selectedOption) => {
                            setFieldValue('isActive', selectedOption || userStatusOptions[0]);
                        }}
                        options={userStatusOptions}
                        placeholder={t('SELECT_STATUS')}
                        isClearable
                        isSearchable
                        className='input-select-border input-select-width'
                    />
                    <div className='flex gap-4 xs:w-full'>
                        <button
                            type="submit"
                            className="btn-search"
                        >
                            {t('SEARCH')}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleClear(setFieldValue)}
                            className="btn-clear"
                        >
                            {t("CLEAR")}
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
}