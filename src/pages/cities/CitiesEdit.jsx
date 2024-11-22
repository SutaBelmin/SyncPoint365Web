import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {citiesService, countriesService} from "../../services";
import * as Yup from "yup"
import Select from "react-select";

export const CitiesEdit = ({ city, closeModal, fetchData }) => {
    const [countries, setCountries] = useState([]);

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
        } catch (error) {

        }
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required!"),
        displayName: Yup.string()
            .required("Display name is required!"),
        postalCode: Yup.string()
            .required("Postal code is required!")
            .matches(/^\d+$/, "Postal code must be a number"),
        countryId: Yup.string()
            .required("Country Id is required!")
    });

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold flex flex-col items-center">Edit City</h1>
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
                                Name
                            </label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="displayName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Display Name
                            </label>
                            <Field
                                type="text"
                                id="displayName"
                                name="displayName"
                                placeholder="Display Name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="postalCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Postal Code
                            </label>
                            <Field
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder="Postal Code"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="countryId" className="block text-gray-700 text-sm font-bold mb-2">
                                Country
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

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded bg-gray-500 text-white px-4 py-2 hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}




