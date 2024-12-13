import React, { useCallback, useEffect, useState } from 'react';
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { Formik, Form, Field } from "formik";
import usersSearchStore from "../stores/UsersSearchStore";
import { enumsService } from "../../../services";

export const UsersSearch = ({ fetchData }) => {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [isActiveOptions, setIsActiveOptions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchRoles = useCallback(async () => {
        try {
            const response = await enumsService.getRoles();
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label === 'SuperAdministrator' ? t('SuperAdministrator') :
                    role.label === 'Administrator' ? t('Administrator') :
                        role.label === 'Employee' ? t('Employee') : role.label
            }));
            setRoles(rolesOptions);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [t]);

    useEffect(() => {
        fetchRoles();

        setIsActiveOptions([
            { value: 'All', label: t('ALL') },
            { value: 'active', label: t('ACTIVE') },
            { value: 'inactive', label: t('INACTIVE') },
        ]);

    }, [fetchRoles, t]);

    const handleSearch = (values) => {
        usersSearchStore.setQuery(values.searchQuery);
        usersSearchStore.setRoleId(values.roleId);
        usersSearchStore.setIsActive(values.isActive.value === 'All' ? null : (values.isActive.value === 'active'));

        const queryParams = usersSearchStore.syncWithQueryParams();
        setSearchParams(queryParams);
        fetchData();
    };

    const handleClear = (setFieldValue) => {
        setSearchParams({});
        setFieldValue("searchQuery", "");
        setFieldValue("roleId", null);
        setFieldValue('isActive', isActiveOptions[0]);
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
        isActive: isActiveOptions.find((option) => option.value === searchParams.get('isActive')) || isActiveOptions[0],
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
                        className="input-search h-10 rounded-md border-gray-300 input-select-width"
                    />

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

                    <Select
                        id="isActive"
                        name="isActive"
                        value={values.isActive}
                        onChange={(selectedOption) => {
                            setFieldValue('isActive', selectedOption || isActiveOptions[0]);
                        }}
                        options={isActiveOptions}
                        placeholder={t('SELECT_STATUS')}
                        isClearable
                        isSearchable
                        className='input-select-border input-select-width'
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