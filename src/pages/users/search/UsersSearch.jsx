import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import usersSearchStore from "../stores/UsersSearchStore";
import { enumsService } from "../../../services";
import Select from "react-select";
import { toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";

export const UsersSearch = ({ fetchData }) => {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [isActiveOptions, setIsActiveOptions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const initialValues = {
        searchQuery: usersSearchStore.searchQuery,
        roleId: usersSearchStore.roleId,
        isActive: usersSearchStore.isActive
    }

    const fetchRoles = useCallback(async () => {
        try {
            const response = await enumsService.getRoles();
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label === 'SuperAdministrator' ? t('SUPER_ADMINISTRATOR') :
                    role.label === 'Administrator' ? t('ADMINISTRATOR') :
                        role.label === 'Employee' ? t('EMPLOYEE') : role.label
            }));
            setRoles(rolesOptions);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [t]);

    useEffect(() => {
        fetchRoles();

        setIsActiveOptions([
            { value: null, label: t('ALL') },
            { value: true, label: t('ACTIVE') },
            { value: false, label: t('INACTIVE') },
        ]);

        const roleIdFromParams = searchParams.get("roleId");
        if (roleIdFromParams)
            usersSearchStore.setRoleId(parseInt(roleIdFromParams));

        const isActiveFromParams = searchParams.get("isActive");
        if (isActiveFromParams)
            usersSearchStore.setIsActive(isActiveFromParams);

    }, [fetchRoles, t, searchParams]);

    const handleSearch = (values) => {
        usersSearchStore.setQuery(values.searchQuery);
        usersSearchStore.setRoleId(values.roleId);
        usersSearchStore.setIsActive(values.isActive);

        const queryParams = usersSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);
        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue("searchQuery", "");
        setFieldValue("roleId", null);
        setFieldValue("isActive", null);
        usersSearchStore.clearFilters();
        fetchData();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSearch}
        >
            {({ setFieldValue, values }) => (
                <Form className="flex flex-col gap-4 md:flex-row">
                    <Field
                        type="text"
                        name="searchQuery"
                        placeholder={t('SEARCH_PLACEHOLDER')}
                        autoComplete="off"
                        className="input-search h-10 rounded-md border-gray-300 w-full"
                    />

                    <Select
                        id="roleId"
                        name="roleId"
                        value={roles.find(role => role.value === values.roleId) || null}
                        onChange={(option) => setFieldValue('roleId', option ? option.value : null)}
                        options={roles}
                        placeholder={t('SELECT_ROLE')}
                        isClearable
                        isSearchable
                        className='input-select-border w-full'
                    />

                    <Select
                        id="isActive"
                        name="isActive"
                        value={isActiveOptions.find(option => option.value === values.isActive) || null}
                        onChange={(option) => setFieldValue('isActive', option ? option.value : null)}
                        options={isActiveOptions}
                        placeholder={t('SELECT_STATUS')}
                        isClearable
                        isSearchable
                        className='input-select-border w-full'
                    />

                    <button type="submit"
                        className="btn-common h-10"
                    >
                        {t("SEARCH")}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClear(setFieldValue)}
                        className="btn-common h-10"
                    >
                        {t("CLEAR")}
                    </button>

                </Form>
            )}
        </Formik>
    );
}