import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { citiesService, countriesService } from "../../services";
import { useRequestAbort } from "../../components/hooks/useRequestAbort";

export const CitiesAdd = ({ closeModal, fetchData }) => {
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();
    const { signal } = useRequestAbort();

    const fetchCountries = useCallback(async () => {
        try {
            const response = await countriesService.getList(signal);
            setCountries(response.data.map(country => ({
                value: country.id,
                label: country.name
            })));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const addCity = async (values) => {
        try {
            await citiesService.add(values, signal);
            fetchData();
            closeModal();
            toast.success(t('ADDED'));
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t('NAME_IS_REQUIRED')),
        displayName: Yup.string()
            .required(t('DISPLAY_NAME_IS_REQUIRED')),
        postalCode: Yup.string()
            .required(t('POSTAL_CODE_IS_REQUIRED'))
            .matches(/^\d+$/, t('POSTAL_CODE_NUMBER')),
        countryId: Yup.string()
            .required("Country Id is required!")
    });

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('ADD_CITY')}</h2>
            <Formik
                initialValues={{
                    name: "",
                    displayName: "",
                    postalCode: "",
                    countryId: ""
                }}
                validationSchema={validationSchema}
                onSubmit={addCity}
            >
                {({ values, setFieldValue }) => (
                    <Form className="w-full max-w-sm">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {t('NAME')} <span className='text-red-500'>*</span>
                            </label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                placeholder={t('NAME')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                            {t('DISPLAY_NAME')} <span className='text-red-500'>*</span>
                            </label>
                            <Field
                                type="text"
                                id="displayName"
                                name="displayName"
                                placeholder={t('DISPLAY_NAME')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                            {t('POSTAL_CODE')} <span className='text-red-500'>*</span>
                            </label>
                            <Field
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder={t('POSTAL_CODE')}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="countryId" className="block text-sm font-medium text-gray-700">
                                {t('SELECT_A_COUNTRY')} <span className='text-red-500'>*</span>
                            </label>
                            <Select
                                options={countries}
                                onChange={(selectedOption) =>
                                    setFieldValue("countryId", selectedOption ? selectedOption.value : "")
                                }
                                value={countries.find((option) => option.value === values.countryId) || null}
                                placeholder={t('SELECT_A_COUNTRY')}
                                className="input-select-border"
                            />
                            <ErrorMessage name="countryId" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn-cancel"
                            >
                                {t('CANCEL')}
                            </button>
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
    );
}