import React, { useEffect } from "react";
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from "formik";
import { citiesService, countriesService } from "../../services";
import { useState } from "react";
import Select from "react-select";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const CitiesAdd = ({ closeModal, fetchData }) => {
    const [countries, setCountries] = useState([]);
    const { t } = useTranslation();

    const fetchCountries = async () => {
        try {
            const response = await countriesService.getList();
            setCountries(response.data.map(country => ({
                value: country.id,
                label: country.name
            })));
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const addCity = async (values) => {
        try {
            await citiesService.add(values);
            fetchData();
            closeModal();
            toast.success("Added new city succesfully!");
        } catch (error) {
            toast.error("There was an error. Please contact administrator.");
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
        <div className="flex flex-col items-center p-4">
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
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                {t('NAME')}
                            </label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                placeholder={t('NAME')}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('DISPLAY_NAME')}
                            </label>
                            <Field
                                type="text"
                                id="displayName"
                                name="displayName"
                                placeholder={t('DISPLAY_NAME')}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('POSTAL_CODE')}
                            </label>
                            <Field
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder={t('POSTAL_CODE')}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="countryId" className="block text-gray-700 text-sm font-bold mb-2">
                                {t('SELECT_A_COUNTRY')}
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
