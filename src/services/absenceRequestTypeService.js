import BaseService from "./baseService";


class AbsenceRequestTypesService extends BaseService {
    async getAbsenceRequestTypes() {
        const response = await this.api.get("/absencerequesttypes/get-absencerequesttypes", {
            cancelToken: null
        });
        console.log(response);
        return response;
    }
}

const absenceRequestTypes = new AbsenceRequestTypesService();
export default absenceRequestTypes;