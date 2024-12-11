import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import usersSearchStore from "../stores/UsersSearchStore";
import { enumsService } from "../../../services";
import Select from "react-select";

export const UsersSearch = () => {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [isActiveOptions] = useState([
        {value: "", label: t('ALL')},
        {value: true, label: t('ACTIVE')},
        {value: false, label: t('INACTIVE')},
    ]);

    const initialValues = {
        searchQuery: usersSearchStore.searchQuery,
        roleId: usersSearchStore.selectedRoleId
    }

    const handleSearch = (values) => {
        usersSearchStore.setQuery(values.searchQuery);
        usersSearchStore.setRoleId(values.roleId);
        usersSearchStore.setIsActive(values.isActive);
    };

    const handleClear = (setFieldValue) => {
        usersSearchStore.clearFilters();
        setFieldValue("searchQuery", "");
        setFieldValue("roleId", null);
        setFieldValue("isActive", null);
    };

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

        }
    }, [t]);

    useEffect(() => {
        fetchRoles();
    });

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSearch}
        >
            {({ setFieldValue, values }) => (
                <Form className="flex flex-col gap-4 md:flex-row">
                    <Field
                        type="text"
                        name="searchQuery"
                        placeholder={t('SEARCH_FIRST_LAST_NAME')}
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