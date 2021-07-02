import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await prisma.user.findFirst({
        where: {
            username: req.query.user.toString(),
        },
        select: {
            id: true,
            username: true,
            name: true,
            eventTypes: true,
            startTime: true,
            timeZone: true,
            endTime: true,
            weekStart: true,
            availability: true,
            hideBranding: true,
        },
    });

    if (!user) {
        return res.status(404).end();
    }

    return res.status(200).json(user);
}
