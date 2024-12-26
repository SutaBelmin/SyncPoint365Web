import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaCalendarAlt } from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { format } from 'date-fns';
import { registerLocale } from "react-datepicker";
import { citiesService, enumsService, usersService } from '../../services';
import { genderConstant, localeConstant, roleConstant } from '../../constants';
import { useRequestAbort } from "../../components/hooks/useRequestAbort";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export const UsersAdd = () => {
    const { t, i18n } = useTranslation();
    const { signal } = useRequestAbort();
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    registerLocale(i18n.language, localeConstant[i18n.language]);

    const addUser = async (values) => {
        try {
            const userId = values.id;
            
            await usersService.getById(userId);

            const formData = new FormData();
            if (values.File){
                formData.append("File", values.File);
                formData.append("UserId", userId); 
            }

            await usersService.uploadProfilePicture(formData);
            await usersService.add(values);
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
            .required(t('EMAIL_IS_REQUIRED'))
            .email(t('EMAIL_IS_NOT_VALID'))
            .test('email-exists', t('EMAIL_ALREADY_EXIST'), async function (value) {
                const { path, createError } = this;
                if (!value)
                    return true;

                if (Yup.string().email().isValidSync(value)) {
                    try {
                        const response = await usersService.emailExists(value, signal);

                        if (response === true)
                            return createError({ path, message: t('EMAIL_ALREADY_EXIST') });

                        return true;
                    } catch (error) {
                        return createError({ path, message: t('ERROR_CONTACT_ADMIN') });
                    }
                } else {
                    return createError({ path, message: t('EMAIL_IS_NOT_VALID') });
                }
            }),
        gender: Yup.string().required(t('GENDER_IS_REQUIRED')),
        birthDate: Yup.string().required(t('BIRTH_DATE_IS_REQUIRED')),
        cityId: Yup.string().required(t('CITY_REQUIRED')),
        address: Yup.string().required(t('ADDRESS_IS_REQUIRED')),
        phone: Yup.string()
            .required(t('PHONE_IS_REQUIRED'))
            .matches(
                /^\+?[1-9]\d{8,14}$|^(\d{3})[-\s]?(\d{3})[-\s]?(\d{4})$/,
                t('PHONE_IS_NOT_VALID')
            ),
        roleId: Yup.string().required(t('ROLE_REQUIRED')),
        password: Yup.string()
            .required(t('PASSWORD_IS_REQUIRED'))
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, t('PASSWORD_RULES')),
        passwordConfirm: Yup.string()
            .required(t('PASSWORD_CONFIRM_IS_REQUIRED'))
            .oneOf([Yup.ref('password')], t('PASSWORDS_MUST_MATCH'))
    });

    const fetchCities = useCallback( async () => {
        try {
            const response = await citiesService.getList(signal);
            const citiesOption = response.data.map(city => ({
                value: city.id,
                label: city.name
            }));
            setCities(citiesOption);
        } catch (error) {

        }
    }, [signal]);

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

        }
    }, [signal, t]);

    const fetchGenders = useCallback(async () => {
        try {
            const response = await enumsService.getGenders(signal);
            const genderOptions = response.data.map(gender => ({
                value: gender.id,
                label: gender.label === genderConstant.male ? t('MALE') : t('FEMALE')
            }));
            setGenders(genderOptions);
        } catch (error) {

        }
    }, [signal, t]);

    useEffect(() => {
        fetchCities();
        fetchRoles();
        fetchGenders();
    }, [fetchCities, fetchGenders, fetchRoles]);


    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <div className="w-full">
                <div className='pt-16 pb-8 flex items-center justify-between'>
                    <h2 className='text-2xl font-bold'>{t('ADD_USER')}</h2>
                    <button
                        type='submit'
                        className="btn-cancel h-10 md:ml-auto w-[8rem] flex items-center justify-center"
                        onClick={() => navigate('/users')}
                    >
                         <FaArrowLeft className="mr-auto" />
                         <span className="flex-grow text-center">{t('BACK')}</span>
                    </button>
                </div>
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
                        password: '',
                        passwordConfirm: '',
                        File: null
                    }}
                    validationSchema={validationSchema}
                    onSubmit={addUser}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="max-w-lg">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('FIRST_NAME')} <span className='text-red-500'>*</span>
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
                                    {t('LAST_NAME')} <span className='text-red-500'>*</span>
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
                                <div className='flex items-center space-x-2'>
                                    <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                                        {t('BIRTH_DATE')}
                                    </label>
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className='text-red-500'>*</span>
                                </div>

                                <DatePicker
                                    id="birthDate"
                                    name="birthDate"
                                    selected={values.birthDate ? new Date(values.birthDate) : null}
                                    onChange={(date) => {
                                        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                                        setFieldValue('birthDate', formattedDate);
                                    }}
                                    dateFormat={t('DATE_FORMAT')}
                                    placeholderText={t('SELECT_BIRTH_DATE')}
                                    showYearDropdown
                                    maxDate={new Date()}
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                    onKeyDown={(e) => e.preventDefault()}
                                    locale={i18n.language}
                                    autoComplete='off'
                                />
                                <ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
                            </div>


                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('GENDER')} <span className='text-red-500'>*</span>
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
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('CITY')} <span className='text-red-500'>*</span>
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
                                    {t('ADDRESS')} <span className='text-red-500'>*</span>
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
                                    {t('PHONE')} <span className='text-red-500'>*</span>
                                </label>
                                <PhoneInput
                                    inputProps={{
                                        name: 'phone',
                                        id: 'phone',
                                        className: 'w-full px-11 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
                                    }}
                                    country={'ba'}
                                    value={values.phone}
                                    onChange={(phone) => setFieldValue('phone', phone)}
                                    countryCodeEditable={false}
                                    international
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('ROLE')} <span className='text-red-500'>*</span>
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
                                    {t('EMAIL')} <span className='text-red-500'>*</span>
                                </label>
                                <Field
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder={t('EMAIL')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onChange={async (e) => {
                                        setFieldValue('email', e.target.value);
                                    }}
                                    autoComplete='off'
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4 relative">
                                <div className="flex items-center">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        {t('PASSWORD')} <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="ml-2 relative group">
                                        <i className="fas fa-info-circle text-gray-500 hover:text-indigo-500 cursor-pointer"></i>
                                        <div className="hidden absolute top-7 left-0 w-max bg-gray-700 text-white text-xs rounded-md p-2 shadow-md group-hover:block">
                                            <p dangerouslySetInnerHTML={{ __html: t('PASSWORD_RULES').replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                                </div>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={t('PASSWORD')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('PASSWORD_CONFIRM')} <span className='text-red-500'>*</span>
                                </label>
                                <Field
                                    type="password"
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    placeholder={t('PASSWORD_CONFIRM')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="passwordConfirm" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="mb-4">
                            <label htmlFor="File" className="block text-sm font-medium text-gray-700">
                                {t('PROFILE_PICTURE')}
                            </label>

                            {imagePreview && (
                                <div className="mb-4 flex justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="w-[250px] h-[250px] object-cover rounded-full mb-4 border-4 border-blue-400"
                                />
                                </div>
                            )}

                            <input
                                type="file"
                                id="File"
                                name="File"
                                onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const previewUrl = URL.createObjectURL(file);
                                    setImagePreview(previewUrl);
                                    setFieldValue("File", file);
                                }
                                }}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:hidden"
                            />

                            <label
                                htmlFor="File"
                                className="inline-flex items-center mt-2 px-3 py-1 bg-blue-400 text-white rounded-md cursor-pointer hover:bg-blue-500 transition-colors"
                            >
                               <FontAwesomeIcon icon={faUpload} className="h-5 w-5 mr-2"/>
                                {t('CHOOSE_PICTURE')}
                            </label>
                            </div>

                            <div className="flex flex-col md:flex-row pb-2">
                                <button
                                    type="submit"
                                    className="btn-common h-10 md:ml-auto"
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
