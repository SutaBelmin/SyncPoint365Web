import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup"
import countriesService from "../../services/countriesService";


const CountriesAdd = ({ closeModal, fetchData }) => {
    
    const validationSchema = Yup.object({
        name: Yup.string()
        .required("Name is required!"),
        displayName: Yup.string()
        .required("Display name is required!")
    });

    const form = useFormik({
        initialValues:{
            name:"",
            displayName:"",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await countriesService.add(values);
                fetchData();
                closeModal();
            } catch (error) {
               
            }
        },
    });

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Add Country</h1>
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
                {form.touched.displayName && form.errors.displayName ? (
                    <div className="text-red-500 text-sm">{form.errors.displayName}</div>
                ) : null}
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
                    Add 
                </button>
            </div>
        </form>
    </div>
    );
};

export default CountriesAdd;