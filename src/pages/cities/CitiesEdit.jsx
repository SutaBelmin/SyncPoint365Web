import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {citiesService, countriesService} from "../../services";

export const CitiesEdit = ({ city, closeModal, fetchData }) => {
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

        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const updateCity = async (values) => {
        try {
            await citiesService.update(values);
            fetchData();
            closeModal();
            toast.success(t('UPDATED'));
        } catch (error) {
            toast.error(t('FAIL_UPDATE'));
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t('NAME_IS_REQUIRED')),
        displayName: Yup.string()
            .required(t('DISPLAY_NAME_IS_REQUIRED')),
        postalCode: Yup.string()
            .required(t('POSTAL_CODE_IS_REQUIRED'))
            .matches(/^\d+$/, "Postal code must be a number"),
        countryId: Yup.string()
            .required("Country Id is required!")
    });

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{t('EDIT_CITY')}</h1>
            <Formik
                initialValues={{
                    id: city.id,
                    name: city.name || "",
                    displayName: city.displayName || "",
                    postalCode: city.postalCode || "",
                    countryId: city.countryId || ""
                }}
                validationSchema={validationSchema}
                onSubmit={updateCity}
            >
                {({ values, setFieldValue }) => (
                    <Form className="w-full max-w-md">
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('NAME')}
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
                            <label
                                htmlFor="displayName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('DISPLAY_NAME')}
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
                            <label
                                htmlFor="postalCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('POSTAL_CODE')}
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
                                {t('SELECT_A_COUNTRY')}
                            </label>
                            <Select
                                options={countries}
                                onChange={(selectedOption) =>
                                    setFieldValue("countryId", selectedOption ? selectedOption.value : "")
                                }
                                value={countries.find((option) => option.value === values.countryId) || null}
                                placeholder="Select a Country"
                                className="input-select-border"
                            />
                            <ErrorMessage name="countryId" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-end gap-4">
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



