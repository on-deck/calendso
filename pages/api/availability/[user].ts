import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getBusyCalendarTimes } from "../../../lib/calendarClient";
import { getBusyVideoTimes } from "../../../lib/videoClient";
import dayjs from "dayjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user } = req.query;

    const currentUser = await prisma.user.findFirst({
        where: {
            username: user,
        },
        select: {
            credentials: true,
            timeZone: true,
            bufferTime: true,
        },
    });

    const availability = fetchUserAvailability(
        {
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
        },
        currentUser
    );

    res.status(200).json(availability);
}

export async function fetchUserAvailability({ dateFrom, dateTo }, user) {
    const selectedCalendars = await prisma.selectedCalendar.findMany({
        where: {
            userId: user.id,
        },
    });

    const hasCalendarIntegrations =
        user.credentials.filter((cred) => cred.type.endsWith("_calendar")).length > 0;
    const hasVideoIntegrations = user.credentials.filter((cred) => cred.type.endsWith("_video")).length > 0;

    const calendarAvailability = await getBusyCalendarTimes(
        user.credentials,
        dateFrom,
        dateTo,
        selectedCalendars
    );
    const videoAvailability = await getBusyVideoTimes(user.credentials, dateFrom, dateTo);

    let commonAvailability = [];

    if (hasCalendarIntegrations && hasVideoIntegrations) {
        commonAvailability = calendarAvailability.filter((availability) =>
            videoAvailability.includes(availability)
        );
    } else if (hasVideoIntegrations) {
        commonAvailability = videoAvailability;
    } else if (hasCalendarIntegrations) {
        commonAvailability = calendarAvailability;
    }

    commonAvailability = commonAvailability.map((a) => ({
        start: dayjs(a.start).subtract(user.bufferTime, "minute").toString(),
        end: dayjs(a.end).add(user.bufferTime, "minute").toString(),
    }));

    return commonAvailability;
}
