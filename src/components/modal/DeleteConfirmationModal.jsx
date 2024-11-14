import React from "react";
import { Formik, Form } from "formik";

const DeleteModal = ({ onDelete, onCancel, entityName }) => {
  return (
    <div className="p-6">
      <h2>Are you sure you want to delete {entityName}?</h2>
      <Formik
        initialValues={{
          confirm: false,
        }}
        onSubmit={(values) => {
          if (values.confirm) {
            onDelete();
          }
        }}
      >
        {() => (
          <Form>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
              <button
                type="submit"
                onClick={() => {
                  onDelete();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
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

export default DeleteModal;
