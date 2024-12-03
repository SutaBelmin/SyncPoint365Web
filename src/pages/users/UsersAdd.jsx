import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from 'react-toastify';
import { citiesService, enumsService, userService } from '../../services';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import Select from "react-select";

export const UsersAdd = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);

    const addUser = async (values) => {
        try {
            await userService.add(values);
            toast.success(t('ADDED'));
            navigate('/users');
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
        gender: Yup.string().required(t('GENDER_IS_REQUIRED')),
        birthDate: Yup.string().required(t('BIRTH_DATE_IS_REQUIRED')),
        cityId: Yup.string().required(t('CITY_REQUIRED')),
        address: Yup.string().required(t('ADDRESS_IS_REQUIRED')),
        phone: Yup.string()
            .required(t('PHONE_IS_REQUIRED'))
            .matches(
                /^\+?[1-9]\d{1,14}$|^(\d{3})[-\s]?(\d{3})[-\s]?(\d{4})$/,
                t('PHONE_IS_NOT_VALID')
            ),
        roleId: Yup.string().required(t('ROLE_REQUIRED')),
        password: Yup.string()
            .required(t('PASSWORD_IS_REQUIRED'))
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, t('PASSWORD_RULES'))
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
            const response = await enumsService.getRoles();
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label,
            }));
            setRoles(rolesOptions);
        } catch (error) {

        }
    };

    const fetchGenders = async () => {
        try {
            const response = await enumsService.getGenders();
            const genderOptions = response.data.map(gender => ({
                value: gender.id,
                label: gender.label
            }));
            setGenders(genderOptions);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchCities();
        fetchRoles();
        fetchGenders();
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
                        gender: '',
                        birthDate: '',
                        cityId: null,
                        address: '',
                        phone: '',
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
                                    {t('EMAIL')}
                                </label>
                                <Field
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder={t('EMAIL')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('GENDER')}
                                </label>
                                <Select
                                    id="gender"
                                    name="gender"
                                    onChange={(option) => setFieldValue('gender', option ? option.value : null)}
                                    options={genders}
                                    placeholder={t('SELECT_A_GENDER')}
                                    isClearable
                                    isSearchable
                                    className='input-select-border mt-1'
                                />
                                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                            </div>



                            <div className="mb-4">
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                    {t('BIRTH_DATE')}
                                </label>
                                <Field
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('CITY')}
                                </label>
                                <Select
                                    id="cityId"
                                    name="cityId"
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
                                    {t('ADDRESS')}
                                </label>
                                <Field
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder={t('ADDRESS')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('PHONE')}
                                </label>
                                <Field
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder={t('PHONE')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('ROLE')}
                                </label>
                                <Select
                                    id="roleId"
                                    name="roleId"
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
