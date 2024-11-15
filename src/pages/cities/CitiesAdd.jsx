import React, { useEffect } from "react";
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from "formik";
import { citiesService, countriesService } from "../../services";
import { useState } from "react";
import Select from "react-select";

export const CitiesAdd = ({ closeModal, fetchData }) => {
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

    const addCity = async (values) => {
        try {
            await citiesService.add(values);
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
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-semibold mb-4">Add City</h2>
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
                                Name
                            </label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
                                Display Name
                            </label>
                            <Field
                                type="text"
                                id="displayName"
                                name="displayName"
                                placeholder="Display name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="displayName" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
                                Postal Code
                            </label>
                            <Field
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder="Postal code"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                className="shadow-sm focus:outline-none focus:ring-0 focus:ring-indigo-500"
                            />
                            <ErrorMessage name="countryId" component="div" className="text-red-500 text-sm" />
                        </div> 

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
