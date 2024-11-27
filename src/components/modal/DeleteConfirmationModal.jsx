import React from "react";
import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const DeleteConfirmationModal = ({ id, onDelete, onCancel, entityName }) => {
  // const handleDelete = () => {
  //   onDelete(id);
  // };
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-white rounded-lg relative w-full max-w-md">
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-xl font-bold">{t('CONFIRM_DELETE')}</h2>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none text-2xl"
        > 
         <FontAwesomeIcon icon = {faTimes} className="w-6 h-6"/>
        </button>
        </div>
        
      <p className="text-gray-700 mb-12 text-center">
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
            <div className="flex justify-end space-x-2 pt-8">
              <button
                type="button"
                onClick={onCancel}
                className="btn-no"
              >
                {t('NO')}
              </button>
              <button
                type="submit"
                 className="btn-yes"
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
