import React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup"
import absenceRequestTypeService from '../../services/absenceRequestTypeService';

const AbsenceRequestTypesAdd = ({ closeModal, fetchData }) => {

    const validationSchema = Yup.object({
        name: Yup.string()
        .required("Name is required!")
    });

    const form = useFormik({
        initialValues:{
            name:"",
            isActive : false,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await absenceRequestTypeService.addData(values);
                fetchData();
                closeModal(); 
            } catch (error) {
            }
        }
    });

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">New Absence Request</h2>
            <form onSubmit={form.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name" 
                        value={form.values.name}
                        onChange={form.handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {form.errors.name && form.touched.name && (
                        <div className="text-red-500 text-sm">{form.errors.name}</div>
                    )}
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={form.values.isActive}
                        onChange={form.handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-gray-700">
                        Active
                    </label>
                </div>
                <div className="flex justify-end space-x-2">
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

export default AbsenceRequestTypesAdd;