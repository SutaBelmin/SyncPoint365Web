import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"
import countriesService from "../../services/countriesService";
import { data } from "autoprefixer";

const CountriesAdd = ({ closeModal, fetchData }) => {
    
    const validationSchema = Yup.object({
        name: Yup.string()
        .required("Name is required!"),
        displayName: Yup.string()
        .required("Display name is required!")
    });

    const formik = useFormik({
        initialValues:{
            name:"",
            displayName:"",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await countriesService.addCountry(values);
                fetchData();
                closeModal();
            } catch (error) {
               
            }
        },
    });

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Add Country</h1>
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm">{formik.errors.name}</div>
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
                    value={formik.values.displayName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter display name"
                />
                {formik.touched.displayName && formik.errors.displayName ? (
                    <div className="text-red-500 text-sm">{formik.errors.displayName}</div>
                ) : null}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
                >
                    Add Country
                </button>
            </div>
        </form>
    </div>
    );
};

export default CountriesAdd;