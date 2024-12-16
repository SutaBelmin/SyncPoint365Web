import { enUS, bs } from "date-fns/locale";


export const localeConstant = {
    enUS: enUS,
    bs: bs
}

export const roleConstant = {
    superAdministrator: 'SuperAdministrator',
    administrator: 'Administrator',
    employee: 'Employee'
}


export const userStatusConstant = {
    all: 'all',
    active: 'active',
    inactive: 'inactive'
}

export const genderConstant = {
    male : 'Male',
    female : 'Female'
}
export const absenceRequestStatuses = {
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PENDING: 'Pending',
};

export const absenceTypeConst = {
    ALL: { value: 'all', labelKey: 'ALL' },
    ACTIVE: { value: 'active', labelKey: 'ACTIVE' },
    INACTIVE: { value: 'inactive', labelKey: 'INACTIVE' },
};

