import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import cityService from "../../services/cityService";
import * as Yup from "yup"
import countriesService from "../../services/countriesService";

const CitiesEdit = ({ city, closeModal, fetchData }) => {
    const [data, setData] = useState([]);

    const fetchCountries = async () => {
        try {
            const response = await countriesService.getList();
            setData(response.data);
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

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

    const form = useFormik({
        initialValues: {
            id: city.id,
            name: city.name || "",
            displayName: city.displayName || "",
            postalCode: city.postalCode || "",
            countryId: city.countryId || ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await cityService.update({
                    id: values.id,
                    name: values.name,
                    displayName: values.displayName,
                    postalCode: values.postalCode,
                    countryId: values.countryId
                });
                fetchData();
                closeModal();
            } catch (error) {

            }
        }
    });

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold flex flex-col items-center">Edit City</h1>
            <form onSubmit={form.handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.values.name}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Name"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.name}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="displayName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Display Name
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={form.values.displayName}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Display Name"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.displayName}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Postal Code
                    </label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={form.values.postalCode}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Display Name"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.postalCode}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label htmlFor="countryId" className="block text-sm font-medium text-gray-700">
                        Country
                    </label>
                    <select
                        id="countryId"
                        name="countryId"
                        value={form.values.countryId}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select a Country</option>
                        {data.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {form.touched.countryId && form.errors.countryId && (
                        <div className="text-red-500 text-sm">{form.errors.countryId}</div>
                    )}
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
            </form>
        </div>
    );
}

export default CitiesEdit;