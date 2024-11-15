import React from "react";
import * as Yup from "yup";
import { countriesService } from "../../services";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";

export const CountriesEdit = ({ country, closeModal, fetchData }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    displayName: Yup.string().required("Display name is required!"),
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Country</h1>
      <Formik
        initialValues={{
          id: country.id,
          name: country.name || "",
          displayName: country.displayName || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await countriesService.update({
              id: values.id,
              name: values.name,
              displayName: values.displayName,
            });
            fetchData();
            closeModal();
            toast.success("Country updated successfully!"); 
          } catch (error) {
            toast.error("Failed to update country. Please try again.");
          } finally {
            setSubmitting(false);
          }
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
                disabled={isSubmitting}
                    className="btn-save"
              >
                Save 
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

