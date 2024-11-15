import React from "react";
import * as Yup from "yup";
import { countriesService } from "../../services";
import { Formik, Form, Field, ErrorMessage } from "formik";

export const CountriesAdd = ({ closeModal, fetchData }) => {

  const addCountry = async (values, setSubmitting) => {
    try {
      await countriesService.add(values);
      fetchData(); 
      closeModal();
    } catch (error) {
      console.error("Failed to add country:", error); 
    } finally {
      setSubmitting(false); 
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    displayName: Yup.string().required("Display name is required!"),
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Country</h1>
      <Formik
        initialValues={{
          name: "",
          displayName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          addCountry(values, setSubmitting); 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Display Name"
              />
              <ErrorMessage
                name="displayName"
                component="div"
                className="text-red-500 text-sm"
              />
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
                disabled={isSubmitting}
                className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-500"
              >
                Add
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};


