import { useEffect} from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import { useTranslation } from "react-i18next"
import { localeConstant } from "../../../constants"
import { Form, Formik } from "formik"
import { companyNewsSearchStore } from "../stores"
import { useLocation, useSearchParams } from "react-router-dom"

export const CompanyNewsSearch = ({ fetchData }) => {
  const [, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const location = useLocation();

  registerLocale(i18n.language, localeConstant[i18n.language])

  useEffect(() => {
    companyNewsSearchStore.initializeQueryParams(location.search);
    setSearchParams(companyNewsSearchStore.queryParams);
  }, [setSearchParams, location.search])

  const handleSearch = (values) => {
    companyNewsSearchStore.setQuery(values.title);
    companyNewsSearchStore.setDateFrom(values.dateFrom);
    companyNewsSearchStore.setDateTo(values.dateTo);

    const queryParams = companyNewsSearchStore.syncWithQueryParams();
    setSearchParams(queryParams);

    fetchData();
  }

  const handleClear = (setFieldValue) => {
    setSearchParams({});
    setFieldValue("title", "");
    setFieldValue("dateFrom", null);
    setFieldValue("dateTo", null);
    companyNewsSearchStore.clearFilters();
    fetchData();
    };

  const initialValues = {
    title: companyNewsSearchStore.query,
    dateFrom: companyNewsSearchStore.dateFrom,
    dateTo: companyNewsSearchStore.dateTo
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSearch}>
      {({ setFieldValue, values }) => (
        <Form className="grid gap-4 w-full">
          <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={(e) => setFieldValue("title", e.target.value)}
              placeholder={t("SEARCH_BY_TITLE")}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <div className="relative">
              <DatePicker
                id="dateFrom"
                name="dateFrom"
                selected={values.dateFrom}
                onChange={(date) => setFieldValue("dateFrom", date)}
                placeholderText={t("DATE_FROM")}
                dateFormat={t("DATE_FORMAT")}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="relative">
              <DatePicker
                id="dateTo"
                name="dateTo"
                selected={values.dateTo}
                onChange={(date) => setFieldValue("dateTo", date)}
                placeholderText={t("DATE_TO")}
                dateFormat={t("DATE_FORMAT")}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              type="submit"
              className="btn-search px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {t("SEARCH")}
            </button>
            <button
              type="button"
              onClick={() => handleClear(setFieldValue)}
              className="btn-clear"
            >
              {t("CLEAR")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
