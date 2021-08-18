import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fetchUserAvailability } from "pages/api/availability/[user]";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req: req });
    if (!session) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }

    if (req.method == "PATCH" || req.method == "POST") {
        const availability = req.body.availability
            ? { create: req.body.availability.openingHours }
            : undefined;
        const customInputs =
            req.method == "POST"
                ? { createMany: { data: req.body.customInputs ?? [] } }
                : !req.body.customInputs
                ? undefined
                : {
                      deleteMany: {
                          eventTypeId: req.body.id,
                          NOT: {
                              id: {
                                  in: req.body.customInputs.filter((input) => !!input.id).map((e) => e.id),
                              },
                          },
                      },
                      createMany: {
                          data: req.body.customInputs
                              .filter((input) => !input.id)
                              .map((input) => ({
                                  type: input.type,
                                  label: input.label,
                                  required: input.required,
                              })),
                      },
                      update: req.body.customInputs
                          .filter((input) => !!input.id)
                          .map((input) => ({
                              data: {
                                  type: input.type,
                                  label: input.label,
                                  required: input.required,
                              },
                              where: {
                                  id: input.id,
                              },
                          })),
                  };
        const data = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            length: parseInt(req.body.length, 10),
            hidden: req.body.hidden,
            locations: req.body.locations,
            eventName: req.body.eventName,
            minimumAdvance: parseInt(req.body.minimumAdvance, 10),
            customInputs,
            availability: availability,
            timeZone: req.body.timeZone,
        };

        if (req.method == "POST") {
            await prisma.eventType.create({
                data: {
                    userId: session.user.id,
                    ...data,
                },
            });
            res.status(200).json({ message: "Event created successfully" });
        } else if (req.method == "PATCH") {
            if (req.body.timeZone) {
                data.timeZone = req.body.timeZone;
            }

            if (req.body.availability) {
                const openingHours = req.body.availability.openingHours || [];
                // const overrides = req.body.availability.dateOverrides || [];

                await prisma.availability.deleteMany({
                    where: {
                        eventTypeId: +req.body.id,
                    },
                });
                Promise.all(
                    openingHours.map((schedule) =>
                        prisma.availability.create({
                            data: {
                                eventTypeId: +req.body.id,
                                days: schedule.days,
                                startTime: schedule.startTime,
                                endTime: schedule.endTime,
                            },
                        })
                    )
                ).catch((error) => {
                    console.log(error);
                });
            }

            await prisma.eventType.update({
                where: {
                    id: req.body.id,
                },
                data,
            });
            res.status(200).json({ message: "Event updated successfully" });
        }
    }

    if (req.method == "DELETE") {
        await prisma.eventTypeCustomInput.deleteMany({
            where: {
                eventTypeId: req.body.id,
            },
        });
        await prisma.eventType.delete({
            where: {
                id: req.body.id,
            },
        });

        res.status(200).json({ message: "Event deleted successfully" });
    }

    if (req.method == "GET") {
        const { dateFrom, dateTo } = req.query;
        const users = await prisma.user.findMany({
            where: {
                eventTypes: { some: { slug: req.query.slug as string } },
            },
            select: {
                credentials: true,
                timeZone: true,
                bufferTime: true,
            },
        });

        const usersWithAvailability = await Promise.all(
            users.map((user) => fetchUserAvailability({ dateFrom, dateTo }, user))
        );

        res.status(200).json(usersWithAvailability);
    }
}
