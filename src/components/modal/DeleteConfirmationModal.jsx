import React from "react";
import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const DeleteConfirmationModal = ({ id, onDelete, onCancel, entityName }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-white rounded-lg relative w-full max-w-md">
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-xl font-bold">{t('CONFIRM_DELETE')}</h2>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-700 focus:outline-none text-2xl"
        > 
         <FontAwesomeIcon icon = {faTimes} className="w-6 h-6"/>
        </button>
        </div>
        
      <p className="text-gray-700 mb-6 text-center">
       {t('ARE_YOU_SURE_YOU_WANT_TO_DELETE?')} <strong>{entityName}</strong>?
      </p>

      <Formik
        initialValues={{
          confirm: false,
        }}
        onSubmit={() => {
          onDelete(id);
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
                className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
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