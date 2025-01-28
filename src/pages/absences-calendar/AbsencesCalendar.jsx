import React, { useCallback, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { absenceRequestsSearchStore } from "../absence-requests/stores";

import { absenceRequestsService } from "../../services";
import { useRequestAbort } from "../../components/hooks";

export const AbsencesCalendar = () => {
    const { t } = useTranslation();
    const { signal } = useRequestAbort();
    const [, setData] = useState([]);
    const [absences, setAbsences] = useState([]);
    const typeColors = {}

    const locales = {
        "en-US": require("date-fns/locale/en-US"),
    };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });

    const fetchData = useCallback(async () => {
        try {
            const filter = { ...absenceRequestsSearchStore.absenceRequestFilter };
            const response = await absenceRequestsService.getPagedList(filter, signal);
            const items = response.data.items;
            setData(items);

            const transformedData = items.map(item => ({
                title: `${item.absenceRequestType.name} - ${item.user.firstName} ${item.user.lastName}`,
                start: new Date(item.dateFrom),
                end: new Date(item.dateTo),
                type: item.absenceRequestType.name.toLowerCase(),
            }));

            setAbsences(transformedData);

        } catch (error) {
            toast.error(t('ERROR_CONTACT_ADMIN'));
        }
    }, [signal, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const generateColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 50%)`;
      };
    
      const getColorForType = (type) => {
        if (typeColors[type]) 
          return typeColors[type];
        
        const newColor = generateColor();
        typeColors[type] = newColor;
        return newColor;
      };
    
      const eventStyleGetter = (event) => {
        const backgroundColor = getColorForType(event.type); 
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
            <h1 className="h1">Odsustva</h1>
            <Calendar
                localizer={localizer}
                events={absences}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};