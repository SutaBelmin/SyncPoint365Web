import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from "yup"
import { absenceRequestTypesService } from "../../services";
import { toast } from 'react-toastify';

export const AbsenceRequestTypesAdd = ({ closeModal, fetchData }) => {

    const validationSchema = Yup.object({
        name: Yup.string()
        .required("Name is required!")
    });

    const addHandling = async (values, actions) => {
        const { setSubmitting } = actions;
        try {
            await absenceRequestTypesService.add(values);
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
            <h2 className="text-lg font-bold mb-4">New Absence Request</h2>
            <Formik
                initialValues={{
                    name: "",
                    isActive: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => addHandling(values, actions)}
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
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                              className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                        >
                            Add 
                        </button>
                    </div>
                </Form>
                
            </Formik>
        </div>
    );
};