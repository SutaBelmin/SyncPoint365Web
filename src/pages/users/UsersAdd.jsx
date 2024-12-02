import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from 'react-toastify';
import { citiesService, enumService, userService } from '../../services';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import Select from "react-select";

export const UsersAdd = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);

    const addUser = async (values) => {
        try {
            await userService.add(values);
            toast.success(t('ADDED'));
            navigate(-1);
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    const validationSchema = Yup.object({
        firstName: Yup.string().required(t('FIRST_NAME_IS_REQUIRED')),
        lastName: Yup.string().required(t('LAST_NAME_IS_REQUIRED')),
        email: Yup.string()
            .email(t('EMAIL_IS_NOT_VALID'))
            .required(t('EMAIL_IS_REQUIRED')),
        cityId: Yup.mixed()
            .required(t('CITY_REQUIRED')),
        roleId: Yup.mixed()
            .required(t('ROLE_REQUIRED')),
        password: Yup.string()
            .required(t('PASSWORD_IS_REQUIRED'))
            .matches( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,t('PASSWORD_RULES'))

    });

    const fetchCities = async () => {
        try {
            const response = await citiesService.getList();
            const citiesOption = response.data.map(city => ({
                value: city.id,
                label: city.name
            }));
            setCities(citiesOption);
        } catch (error) {
            
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await enumService.getEnums();
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label,
            }));
            setRoles(rolesOptions);
        } catch (error) {
            
        }
    };

    useEffect(() => {
        fetchCities();
        fetchRoles();
    }, []);

    return (
        <div className="p-4">
            <div className="w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">{t('ADD_USER')}</h2>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        cityId: null,
                        roleId: null,
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={addUser}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="w-full">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('FIRST_NAME')}
                                </label>
                                <Field
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder={t('FIRST_NAME')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('LAST_NAME')}
                                </label>
                                <Field
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder={t('LAST_NAME')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Field
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('CITY')}
                                </label>
                                <Select
                                    id="cityId"
                                    name="cityId"
                                    //value={cities.find(city => city.value === values.cityId) || null}
                                    onChange={(option) => setFieldValue('cityId', option ? option.value : null)}
                                    options={cities}
                                    placeholder={t('SELECT_A_CITY')}
                                    isClearable
                                    isSearchable
                                    className='input-select-border mt-1'
                                />
                                <ErrorMessage name="cityId" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('ROLE')}
                                </label>
                                <Select
                                    id="roleId"
                                    name="roleId"
                                    //value={roles.find(role => role.value === values.roleId) || null}
                                    onChange={(option) => setFieldValue('roleId', option ? option.value : null)}
                                    options={roles}
                                    placeholder={t('SELECT_ROLE')}
                                    isClearable
                                    isSearchable
                                    className='input-select-border mt-1'
                                />
                                <ErrorMessage name="roleId" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('PASSWORD')}
                                </label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={t('PASSWORD')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>


                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="btn-save"
                                >
                                    {t('SAVE')}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
