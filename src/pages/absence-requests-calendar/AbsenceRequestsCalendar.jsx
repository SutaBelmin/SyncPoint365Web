import React, { useCallback, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { useRequestAbort } from "../../components/hooks";
import { absenceRequestsSearchStore } from "../absence-requests/stores";
import { absenceRequestsService } from "../../services";
import { AbsenceRequestsCalendarSearch } from "./search";
import { localeConstant, roleConstant } from '../../constants';
import { useAuth } from '../../context/AuthProvider';

export const AbsenceRequestsCalendar = () => {
  const { t, i18n } = useTranslation();
  const { signal } = useRequestAbort();
  const [absences, setAbsences] = useState([]);
  const { loggedUser } = useAuth();

  const fetchData = useCallback(async (userId = null) => {
    try {
      const filter = {
        ...absenceRequestsSearchStore.absenceRequestFilter,
        userId: userId
      };
      const response = await absenceRequestsService.getPagedList(filter, signal);
      const items = response.data.items;

      const transformedData = items.map(item => ({
        title: `${item.absenceRequestType.name} - ${item.user.firstName} ${item.user.lastName}`,
        start: new Date(item.dateFrom),
        end: new Date(item.dateTo),
        color: item.absenceRequestType.color,
      }));

      setAbsences(transformedData);

    } catch (error) {
      toast.error(t('ERROR_CONTACT_ADMIN'));
    }
  }, [signal, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { [i18n.language]: localeConstant[i18n.language] },
  });

  const period = {
    today: t('TODAY'),
    previous: t('BACK'),
    next: t('NEXT'),
    month: t('MONTH'),
    week: t('WEEK'),
    day: t('DAY'),
    agenda: t('AGENDA'),
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#00ff00";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "4px",
        padding: "4px",
      },
    };
  };

  return (
    <div className="p-6">
      <h1 className="h1">{t('ABSENCE_REQUEST_CALENDAR')}</h1>

      {loggedUser.role !== roleConstant.employee &&
        <AbsenceRequestsCalendarSearch
          fetchData={fetchData}
        />
      }

      <Calendar
        localizer={localizer}
        events={absences}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        messages={period}
        culture={i18n.language}
      />
    </div>
  );
};