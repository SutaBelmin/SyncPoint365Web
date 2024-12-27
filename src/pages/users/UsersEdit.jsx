import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from 'react-toastify';
import { citiesService, enumsService, usersService } from '../../services';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { format } from 'date-fns';
import { registerLocale } from "react-datepicker";
import { FaArrowLeft } from 'react-icons/fa';
import { roleConstant, genderConstant, localeConstant } from '../../constants';
import { useRequestAbort } from "../../components/hooks/useRequestAbort";

export const UsersEdit = () => {
    const { t, i18n } = useTranslation();
    const { signal } = useRequestAbort();
    const navigate = useNavigate();
    const { userId } = useParams(); 
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [user, setUser] = useState(null);
    
    registerLocale(i18n.language, localeConstant[i18n.language]);

    const updateUser = async (values) => {
        try {
            await usersService.update({...values, id:userId}, signal); 
            toast.success(t('UPDATED'));
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
                
                const currentUserEmail = user.email;

                if(value === currentUserEmail){
                    return true;
                }

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
        birthDate: Yup.string().required(t('BIRTH_DATE_IS_REQUIRED')),
        cityId: Yup.string().required(t('CITY_REQUIRED')),
        address: Yup.string().required(t('ADDRESS_IS_REQUIRED')),
        phone: Yup.string()
            .required(t('PHONE_IS_REQUIRED'))
    });

    const rolesOptions = roles.map(role => ({
        ...role,
        label: role.label === roleConstant.superAdministrator ? t('SUPER_ADMINISTRATOR') :
               role.label === roleConstant.administrator ? t('ADMINISTRATOR') :
               role.label === roleConstant.employee ? t('EMPLOYEE') : role.label
    }));

    const genderOptions = genders.map(gender => ({
        ...gender,
        label: gender.label === genderConstant.male ? t('MALE') :
               gender.label === genderConstant.female ? t('FEMALE') :
               gender.label 
    }));

    const fetchUser = useCallback(async () => {
        try {
            const response = await usersService.getById(userId, signal);
            setUser(response.data);
        } catch (error) {
            toast.error(t('ERROR_LOADING_USER'));
        }
    }, [userId, signal, t]);

    const fetchCities = useCallback(async () => {
        try {
            const response = await citiesService.getList(signal);
            const citiesOption = response.data.map(city => ({
                value: city.id,
                label: city.name
            }));
            setCities(citiesOption);
        } catch (error) {
            toast.error(t('ERROR_LOADING_CITIES'));
        }
    }, [signal, t]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await enumsService.getRoles(signal);
            const rolesOptions = response.data.map(role => ({
                value: role.id,
                label: role.label
            }));
            setRoles(rolesOptions);
        } catch (error) {
            toast.error(t('ERROR_LOADING_ROLES'));
        }
    }, [signal, t]);

    const fetchGenders = useCallback(async () => {
        try {
            const response = await enumsService.getGenders(signal);
            const genderOptions = response.data.map(gender => ({
                value: gender.id,
                label: gender.label 
            }));            
            setGenders(genderOptions);
        } catch (error) {
            toast.error(t('ERROR_LOADING_GENDERS'))
        }
    }, [signal, t]);

    useEffect(() => {
         fetchUser();
         fetchCities();
         fetchRoles();
         fetchGenders();
    }, [fetchUser, fetchCities, fetchGenders, fetchRoles]);

    const handleBack = () => {
        navigate('/users');
    }

    if (!user) return <div>{t('LOADING')}</div>;

    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <div className="w-full max-w-lg">
            <div className="realtive">
            <button
            onClick={handleBack}
            className="btn-cancel h-10 md:ml-auto w-[8rem] flex items-center justify-center absolute top-20 right-5"
            >
            <FaArrowLeft className="mr-auto"/>
            <span className="flex-grow text-center">{t('BACK')}</span>
            </button>
            </div>
                <h1 className="h1">{t('UPDATE_USER')}</h1>
                <Formik
                    initialValues={{
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        gender: genders.find(g => g.label.toLowerCase() === user.gender.toLowerCase())?.value,
                        birthDate: user.birthDate || '',
                        cityId: user.cityId || null,
                        address: user.address || '',
                        phone: user.phone || '',
                        role: roles.find(r => r.label.toLowerCase() === user.role.toLowerCase())?.value
                    }}
                    validationSchema={validationSchema}
                    onSubmit={updateUser}
                >
                    {({ setFieldValue, values }) => (                        
                       <Form className="w-full">

                       <div className="mb-4">
                           <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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
                           <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
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
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                               {t('EMAIL')} <span className='text-red-500'>*</span>
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
                           <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                               {t('GENDER')} <span className='text-red-500'>*</span>
                           </label>
                           <Select
                               id="gender"
                               name="gender"
                               onChange={(option) => setFieldValue('gender', option ? option.value : '')}
                               options={genderOptions}
                               placeholder={t('SELECT_GENDER')}
                               value={genderOptions.find((gender) => gender.value === values.gender)} 
                               getOptionLabel={option => option.label}
                               getOptionValue={option => option.value}
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                       </div>

                        <div className="mb-4">
                           <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                               {t('ROLE')} <span className='text-red-500'>*</span>
                           </label>
                           <Select
                               id="role"
                               name="role"
                               onChange={(option) => setFieldValue('role', option ? option.value : '')}
                               options={rolesOptions}
                               value={rolesOptions.find((role) => role.value === values.role)} 
                               getOptionLabel={option => option.label}
                               getOptionValue={option => option.value}
                               placeholder={t('SELECT_ROLE')}
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="roleId" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       <div className="mb-4">
                           <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                               {t('BIRTH_DATE')} <span className='text-red-500'>*</span>
                           </label>
                           <DatePicker
                               id="birthDate"
                               name="birthDate"
                               selected={values.birthDate ? new Date(values.birthDate) : null} 
                               onChange={(date) => {
                               const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                               setFieldValue("birthDate", formattedDate)
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
                           <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                               {t('PHONE')} <span className='text-red-500'>*</span>
                           </label>
                           <Field
                               name="phone"
                               render={({ field }) => (
                                   <PhoneInput
                                        inputProps={{
                                            name: 'phone',
                                            id: 'phone',
                                            className: 'w-full px-11 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        }}
                                       {...field}
                                       onChange={(value) => setFieldValue('phone', value)}
                                       value={values.phone}
                                       enableSearch
                                       country={'ba'}
                                       className="phone-input"
                                   />
                               )}
                           />
                           <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       <div className="mb-4">
                           <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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
                           <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">
                               {t('CITY')} <span className='text-red-500'>*</span>
                           </label>
                           <Select
                               id="cityId"
                               name="cityId"
                               onChange={(option) => setFieldValue('cityId', option ? option.value : null)}
                               options={cities}
                               value={cities.find(city => city.value === values.cityId)} 
                               placeholder={t('SELECT_CITY')}
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="cityId" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       <div className="mb-4 flex">
                           <button
                               type="submit"
                               className="btn-save ml-auto"
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
