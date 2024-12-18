import React, { useCallback, useEffect, useState } from 'react';
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { Formik, Form, Field } from "formik";
import usersSearchStore from "../stores/UsersSearchStore";
import { enumsService } from "../../../services";
import { userStatusConstant, roleConstant } from '../../../constants';

export const UsersSearch = ({ fetchData }) => {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [userStatusOptions, setUserStatusOptions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchRoles = useCallback(async () => {
        try {
            const response = await enumsService.getRoles();
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
    }, [t]);

    useEffect(() => {
        fetchRoles();

        setUserStatusOptions([
            { value: userStatusConstant.all, label: t('ALL') },
            { value: userStatusConstant.active, label: t('ACTIVE') },
            { value: userStatusConstant.inactive, label: t('INACTIVE') },
        ]);

    }, [fetchRoles, t]);

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
                <Form className="grid gap-4 w-full lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 ss:grid-cols-1">
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
                            setFieldValue('isActive', selectedOption || userStatusOptions[0]);
                        }}
                        options={userStatusOptions}
                        placeholder={t('SELECT_STATUS')}
                        isClearable
                        isSearchable
                        className='input-select-border input-select-width'
                    />
                    <div className='flex gap-4'> 
                        <button type="submit"
                            className="btn-new h-10 w-full"
                        >
                            {t("SEARCH")}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleClear(setFieldValue)}
                            className="btn-cancel h-10 w-full"
                        >
                            {t("CLEAR")}
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
}