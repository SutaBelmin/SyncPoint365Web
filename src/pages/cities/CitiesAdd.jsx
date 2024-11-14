import React, { useEffect } from "react";
import * as Yup from "yup"
import { useFormik } from "formik";
import cityService from "../../services/cityService";
import countriesService from "../../services/countriesService";
import { useState } from "react";

const CitiesAdd = ({ closeModal, fetchData }) => {
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
            name: "",
            displayName: "",
            postalCode: "",
            countryId: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await cityService.add(values);
                fetchData();
                closeModal();
            } catch (error) {

            }
        },
    });

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-semibold mb-4">Add City</h2>
            <form onSubmit={form.handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.values.name}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        placeholder="Name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.name}</div>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={form.values.displayName}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        placeholder="Display name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.displayName}</div>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={form.values.postalCode}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        placeholder="Postal code"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {form.touched.name && form.errors.name ? (
                        <div className="text-red-500 text-sm">{form.errors.postalCode}</div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label htmlFor="countryId" className="block text-gray-700 text-sm font-bold mb-2">
                        Select Country
                    </label>
                    <select
                        id="countryId"
                        name="countryId"
                        onChange={form.handleChange}
                        value={form.values.countryId}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select a country</option>
                        {data.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {form.touched.countryId && form.errors.countryId ? (
                        <div className="text-red-500 text-sm">{form.errors.countryId}</div>
                    ) : null}
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
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CitiesAdd;