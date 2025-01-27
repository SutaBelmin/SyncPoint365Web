import { useTranslation } from "react-i18next";
import { companyNewsService } from "../../services";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";

export const CompanyNewsEdit = ({ companyNews, closeModal, fetchData }) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        title: Yup.string().required(t('TITLE_IS_REQUIRED')),
        text: Yup.string().required(t('TEXT_IS_REQUIRED')),
    });

    const handleSubmit = async (values) => {
        try {
            await companyNewsService.update(values);
            toast.success(t('UPDATED'));
            fetchData();
            closeModal();
        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{t('EDIT_COMPANY_NEWS')}</h2>
            <Formik
                initialValues={{
                    id: companyNews.id,
                    title: companyNews.title || "",
                    text: companyNews.text || "",
                    isVisible: companyNews.isVisible || false,
                    userId: companyNews.userId,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
                            <ReactQuill
                                theme="snow"
                                value={values.text}
                                onChange={(value) => setFieldValue("text", value)}
                                style={{
                                    height: "300px",
                                    overflowY: "auto",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.375rem",
                                }}
                            />
                            <ErrorMessage
                                name="text"
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
