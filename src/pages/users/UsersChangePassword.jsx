import { Formik, Form } from "formik";
import { t } from "i18next";


export const UsersChangePassword = ({ closeModal, fetchData }) => {

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('CHANGE_PASSWORD')}</h2>
            <Formik>
                <Form>

                </Form>
            </Formik>

        </div>

    );
}