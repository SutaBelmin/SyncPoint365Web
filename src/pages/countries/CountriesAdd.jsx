import React from "react";
import * as Yup from "yup";
import { countriesService } from "../../services";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

export const CountriesAdd = ({ closeModal, fetchData }) => {
  const { t } = useTranslation();

  const addCountry = async (values, setSubmitting) => {
    try {
      await countriesService.add(values);
      fetchData(); 
      toast.success(t('ADDED'));
      closeModal();
    } catch (error) {
      toast.error(t('ERROR_CONTACT_ADMIN')); 
    } finally {
      setSubmitting(false); 
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t('NAME_IS_REQUIRED')),
    displayName: Yup.string().required(t('DISPLAY_NAME_IS_REQUIRED')),
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">{t('ADD_COUNTRY')}</h1>
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
                {t('NAME')} <span className='text-red-500'>*</span>
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t('NAME')}
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
                {t('DISPLAY_NAME')} <span className='text-red-500'>*</span>
              </label>
              <Field
                type="text"
                id="displayName"
                name="displayName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t('DISPLAY_NAME')}
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
                {t('CANCEL')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-save"
              >
                {t('SAVE')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};


