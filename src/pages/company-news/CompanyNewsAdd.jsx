import { useTranslation } from "react-i18next";
import { companyNewsService } from "../../services";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Editor } from "@tinymce/tinymce-react"; 
import * as Yup from "yup";

export const CompanyNewsAdd = ({ closeModal, fetchData }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    title: Yup.string().required(t('TITLE_IS_REQUIRED')),
    text: Yup.string().required(t('TEXT_IS_REQUIRED')),
  });

  const addCompanyNews = async (values) => {
    try {
      await companyNewsService.add({
        title: values.title,
        text: values.text,
        isVisible: values.isVisible
      });
      fetchData();
      closeModal();
      toast.success(t('ADDED'));
    } catch (error) {
      toast.error(t('ERROR_CONTACT_ADMIN'));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('ADD_COMPANY_NEWS')}</h2>
      <Formik
        initialValues={{
          title: "",
          text: "",
          isVisible: false
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => addCompanyNews(values, actions)}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                {t('TITLE_NEWS')} <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder={t('TITLE_NEWS')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                {t('TEXT')} <span className="text-red-500">*</span>
              </label>
              <Editor
                apiKey={process.env.REACT_APP_TEXT_EDITOR_API_KEY} 
                value={values.text}
                onEditorChange={(content) => setFieldValue("text", content)}
                init={{
                  height: 300,
                  menubar: true,
                  branding: false,
                  cookie_samesite: "None",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | link image",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                }}
              />
              <ErrorMessage
                name="text"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <Field type="checkbox" name="isVisible" className="mr-2" />
                {t('IS_VISIBLE')}
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="btn-cancel"
              >
                {t('CANCEL')}
              </button>
              <button type="submit" className="btn-save">
                {t('ADD')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
