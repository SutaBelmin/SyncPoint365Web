import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from 'react-toastify';
import { citiesService, enumsService, userService } from '../../services';
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
import { enUS, bs } from "date-fns/locale";


export const UsersUpdate = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { userId } = useParams(); 
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [user, setUser] = useState(null);
    const [userGender, setUserGender] = useState(null);
    
    const localeMapping = {
        en: enUS,
        bs: bs
    };

    const currentLanguage = i18n.language || 'en';
    const currentLocale = localeMapping[currentLanguage];

    registerLocale(currentLanguage, currentLocale);

    const updateUser = async (values) => {
        try {
            await userService.update({...values, id:userId}); 
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
                        const response = await userService.emailExists(value);

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

    const fetchUser = useCallback(async () => {
        try {
            const response = await userService.getById(userId);
            setUser(response.data);
            setUserGender(response.data.gender);
        } catch (error) {
            toast.error(t('ERROR_LOADING_USER'));
        }
    }, [userId, setUser, t]);

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

    const fetchGenders = useCallback(async () => {
        try {
            const response = await enumsService.getGenders();
            const genderOptions = response.data.map(gender => ({
                value: gender.id,
                label: gender.label === 'Male' ? t('MALE') : t('FEMALE')
            }));            
            setGenders(genderOptions);
        } catch (error) {

        }
    }, [t]);

    useEffect(() => {
        fetchUser();
        fetchCities();
        fetchRoles();
        fetchGenders();
    }, [fetchGenders, fetchRoles, fetchUser]);

    if (!user || !genders.length) return <div>Loading...</div>;

    return (
        <div className="flex-1 p-6 bg-gray-100 h-screen">
            <div className="w-full max-w-lg">
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
                    enableReinitialize={true}
                >
                    {({ setFieldValue, values }) => (                        
                       <Form className="w-full">

                       {/* First Name */}
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
                   
                       {/* Last Name */}
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
                    
                       {/* Email */}
                       <div className="mb-4">
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                               {t('EMAIL')} <span className='text-red-500'>*</span>
                           </label>
                           <Field
                               type="email"
                               id="email"
                               name="email"
                               placeholder={t('EMAIL')}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           />
                           <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       {/* Gender */}
                       <div className="mb-4">
                           <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                               {t('GENDER')} <span className='text-red-500'>*</span>
                           </label>
                           <Select
                               id="gender"
                               name="gender"
                               onChange={(option) => setFieldValue('gender', option ? option.value : '')}
                               options={genders}
                               placeholder={t('SELECT_GENDER')}
                               value={genders.find(g=>g.value === userGender)} 
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                       </div>

                        {/* Role */}
                        <div className="mb-4">
                           <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                               {t('ROLE')} <span className='text-red-500'>*</span>
                           </label>
                           <Select
                               id="role"
                               name="role"
                               onChange={(option) => setFieldValue('role', option ? option.value : '')}
                               options={roles}
                               value={roles.find(role => role.values === values.role)} 
                               placeholder={t('SELECT_ROLE')}
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="roleId" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       {/* Birth Date */}
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
                               locale={currentLanguage}
                           />
                           <ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
                       </div>
                       
                       {/* Phone */}
                       <div className="mb-4">
                           <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                               {t('PHONE')} <span className='text-red-500'>*</span>
                           </label>
                           <Field
                               name="phone"
                               render={({ field }) => (
                                   <PhoneInput
                                       {...field}
                                       onChange={(value) => setFieldValue('phone', value)}
                                       inputClass="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                   />
                               )}
                           />
                           <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       {/* Address */}
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
                   
                       {/* City */}
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
                               isClearable
                               isSearchable
                               className='input-select-border mt-1'
                           />
                           <ErrorMessage name="cityId" component="div" className="text-red-500 text-sm" />
                       </div>
                   
                       {/* Submit button */}
                       <div className="mb-4">
                           <button
                               type="submit"
                               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
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
