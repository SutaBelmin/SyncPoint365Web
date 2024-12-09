import React from "react";
import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const ConfirmationModal = ({ title, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-white rounded-2xl relative">
      <button
        onClick={onCancel}
        className="absolute -top-2 -right-1 text-gray-400 hover:text-gray-600 focus:outline-none text-xl"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className="flex justify-center items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>

      <Formik
        initialValues={{ confirm: false }}
        onSubmit={() => {
          onConfirm();
        }}
      >
        {() => (
          <Form>
            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
              >
                {t('NO')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none"
              >
                {t('YES')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
