import React from "react";
import { Formik, Form } from "formik";

export const DeleteConfirmationModal = ({ onDelete, onCancel, entityName }) => {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="p-8 bg-white rounded-lg relative w-full max-w-md">
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-xl font-bold">Confirm Delete</h2>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-3xl"
        >
          &times;
        </button>
      </div>

      <p className="text-gray-700 mb-12 text-center">
        Are you sure you want to delete <strong>{entityName}</strong>?
      </p>

      <Formik
        initialValues={{
          confirm: false,
        }}
        onSubmit={() => {
          handleDelete();
        }}
      >
        {() => (
          <Form>
            <div className="flex justify-end space-x-2 pt-8">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-3 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-500"
              >
                Yes
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

