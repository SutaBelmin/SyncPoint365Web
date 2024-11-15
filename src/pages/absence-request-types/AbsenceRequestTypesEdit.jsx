import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from "yup"
import { absenceRequestTypesService } from "../../services";

export const AbsenceRequestTypesEdit = ({ absenceRequestType, closeModal, fetchData }) => {

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required!")
    });

    const editHandling = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestTypesService.update({
                id: absenceRequestType.id,
                name: values.name,
                isActive: values.isActive,
            });
            fetchData();
            closeModal(); 
        } catch (error) {
        }
        finally{
            setSubmitting(false);
        }
    }


    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Edit Absence Request</h2>
            <Formik
                initialValues={{
                    id: absenceRequestType.id,
                    name: absenceRequestType.name,
                    isActive: absenceRequestType.isActive,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => editHandling(values, actions)}
            >
                <Form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            className="w-full p-2 border rounded"
                        />
                </div>
                    <div className="mb-4 flex items-center">
                        <Field
                            type="checkbox"
                            id="isActive"
                            name="isActive"
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
                            Submit 
                        </button>
                    </div>
                </Form>
                
            </Formik>
        </div>
    );


}