import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { CalendarIcon, ClockIcon, ExclamationIcon, LocationMarkerIcon } from "@heroicons/react/solid";
import prisma from "../../lib/prisma";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { LocationType } from "../../lib/location";
import Avatar from "../../components/Avatar";
import Button from "../../components/ui/Button";
import { EventTypeCustomInputType } from "../../lib/eventTypeInput";
import { AnalyticsTrackingEvent } from "@lib/analytics";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Book(props: any): JSX.Element {
    const router = useRouter();
    const { date, email = "", name = "", id: userId = "", user, rescheduleUid } = router.query;

    const [is24h, setIs24h] = useState(false);
    const [preferredTimeZone, setPreferredTimeZone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const locations = props.eventType.locations || [];

    const [selectedLocation, setSelectedLocation] = useState<LocationType>(
        locations.length === 1 ? locations[0].type : ""
    );
    useEffect(() => {
        setPreferredTimeZone(localStorage.getItem("timeOption.preferredTimeZone") || dayjs.tz.guess());
        setIs24h(!!localStorage.getItem("timeOption.is24hClock"));

        window.analytics.track(AnalyticsTrackingEvent.TimeSelected, {
            action: "Time Selected",
            category: "Booking",
            date,
            eventType: props.eventType.slug,
            providerId: user,
        });
    }, [date, props.eventType.slug, user]);

    const locationInfo = (type: LocationType) => locations.find((location) => location.type === type);

    // TODO: Move to translations
    const locationLabels = {
        [LocationType.InPerson]: "In-person meeting",
        [LocationType.Phone]: "Phone call",
        [LocationType.GoogleMeet]: "Google Meet",
        [LocationType.Zoom]: "Zoom Video",
    };

    const bookingHandler = (event) => {
        const book = async () => {
            setLoading(true);
            setError(false);
            let notes = "";
            if (props.eventType.customInputs) {
                notes = props.eventType.customInputs
                    .map((input) => {
                        const data = event.target["custom_" + input.id];
                        if (data) {
                            if (input.type === EventTypeCustomInputType.Bool) {
                                return input.label + "\n" + (data.value ? "Yes" : "No");
                            } else {
                                return input.label + "\n" + data.value;
                            }
                        }
                    })
                    .join("\n\n");
            }
            if (!!notes && !!event.target.notes?.value) {
                notes += "\n\nAdditional notes:\n" + event.target.notes?.value ?? "";
            } else {
                notes += event.target.notes?.value ?? "";
            }

            const payload = {
                start: dayjs(date).format(),
                end: dayjs(date).add(props.eventType.length, "minute").format(),
                id: userId,
                name: event.target.name.value,
                email: event.target.email.value,
                notes: notes,
                timeZone: preferredTimeZone,
                eventTypeId: props.eventType.id,
                rescheduleUid: rescheduleUid,
            };

            if (selectedLocation) {
                switch (selectedLocation) {
                    case LocationType.Phone:
                        payload["location"] = event.target.phone.value;
                        break;

                    case LocationType.InPerson:
                        payload["location"] = locationInfo(selectedLocation).address;
                        break;

                    // Catches all other location types, such as Google Meet, Zoom etc.
                    default:
                        payload["location"] = selectedLocation;
                }
            }

            window.analytics.track(AnalyticsTrackingEvent.BookingConfirmed, {
                action: "Confirmed Booking",
                category: "Booking",
                start: dayjs(date).format(),
                end: dayjs(date).add(props.eventType.length, "minute").format(),
                userId,
                userName: event.target.name.value,
                userEmail: event.target.email.value,
                eventType: props.eventType.slug,
                providerId: user,
                booking: rescheduleUid,
            });

            /*const res = await */ fetch("/api/book/" + user, {
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            // TODO When the endpoint is fixed, change this to await the result again
            //if (res.ok) {
            let successUrl = `/success?date=${date}&type=${props.eventType.id}&user=${
                props.user.username
            }&reschedule=${!!rescheduleUid}&name=${payload.name}`;
            if (payload["location"]) {
                if (payload["location"].includes("integration")) {
                    successUrl += "&location=" + encodeURIComponent("Web conferencing details to follow.");
                } else {
                    successUrl += "&location=" + encodeURIComponent(payload["location"]);
                }
            }

            await router.push(successUrl);
            /*} else {
                setLoading(false);
                setError(true);
            }*/
        };

        event.preventDefault();
        book();
    };

    const isFeedback = ["pitch-feedback", "product-feedback"].includes(props.eventType.slug);
    console.log("props.eventType.slug", props.eventType.slug);

    return (
        <div>
            <Head>
                <title>
                    {rescheduleUid ? "Reschedule" : "Confirm"} your {props.eventType.title} with{" "}
                    {props.user.name || props.user.username} | Calendso
                </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="max-w-3xl mx-auto my-24">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="sm:flex px-4 py-5 sm:p-6">
                        <div className="sm:w-1/2 sm:border-r">
                            <Avatar user={props.user} className="w-16 h-16 rounded-full mb-4" />
                            <h2 className="font-medium text-gray-500">{props.user.name}</h2>
                            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                                {props.eventType.title}
                            </h1>
                            <p className="text-gray-500 mb-2">
                                <ClockIcon className="inline-block w-4 h-4 mr-1 -mt-1" />
                                {props.eventType.length} minutes
                            </p>
                            {selectedLocation === LocationType.InPerson && (
                                <p className="text-gray-500 mb-2">
                                    <LocationMarkerIcon className="inline-block w-4 h-4 mr-1 -mt-1" />
                                    {locationInfo(selectedLocation).address}
                                </p>
                            )}
                            <p className="text-blue-600 mb-4">
                                <CalendarIcon className="inline-block w-4 h-4 mr-1 -mt-1" />
                                {preferredTimeZone &&
                                    dayjs(date)
                                        .tz(preferredTimeZone)
                                        .format((is24h ? "H:mm" : "h:mma") + ", dddd DD MMMM YYYY")}
                            </p>
                            <p className="text-gray-600">{props.eventType.description}</p>
                        </div>
                        <div className="sm:w-1/2 pl-8 pr-4">
                            <form onSubmit={bookingHandler}>
                                <div className={classNames("mb-4", { hidden: isFeedback && !!name })}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Your name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="John Doe"
                                            defaultValue={
                                                props.booking
                                                    ? props.booking.attendees[0].name
                                                    : name
                                                    ? decodeURIComponent(name as string)
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="you@example.com"
                                            defaultValue={
                                                props.booking
                                                    ? props.booking.attendees[0].email
                                                    : email
                                                    ? decodeURIComponent(email as string)
                                                    : ""
                                            }
                                        />
                                    </div>
                                </div>
                                {locations.length > 1 && (
                                    <div className="mb-4">
                                        <span className="block text-sm font-medium text-gray-700">
                                            Location
                                        </span>
                                        {locations.map((location) => (
                                            <label key={location.type} className="block">
                                                <input
                                                    type="radio"
                                                    required
                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                    className="location"
                                                    name="location"
                                                    value={location.type}
                                                    checked={selectedLocation === location.type}
                                                />
                                                <span className="text-sm ml-2">
                                                    {locationLabels[location.type]}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {selectedLocation === LocationType.Phone && (
                                    <div className="mb-4">
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <div className="mt-1">
                                            <PhoneInput
                                                name="phone"
                                                placeholder="Enter phone number"
                                                id="phone"
                                                required
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                onChange={() => {
                                                    /* DO NOT REMOVE: Callback required by PhoneInput, comment added to satisfy eslint:no-empty-function */
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {props.eventType.customInputs &&
                                    props.eventType.customInputs
                                        .sort((a, b) => a.id - b.id)
                                        .map((input) => (
                                            <div className="mb-4" key={"input-" + input.label.toLowerCase}>
                                                {input.type !== EventTypeCustomInputType.Bool && (
                                                    <label
                                                        htmlFor={input.label}
                                                        className="block text-sm font-medium text-gray-700 mb-1">
                                                        {input.label}
                                                    </label>
                                                )}
                                                {input.type === EventTypeCustomInputType.TextLong && (
                                                    <textarea
                                                        name={"custom_" + input.id}
                                                        id={"custom_" + input.id}
                                                        required={input.required}
                                                        rows={3}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder=""
                                                    />
                                                )}
                                                {input.type === EventTypeCustomInputType.Text && (
                                                    <input
                                                        type="text"
                                                        name={"custom_" + input.id}
                                                        id={"custom_" + input.id}
                                                        required={input.required}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder=""
                                                    />
                                                )}
                                                {input.type === EventTypeCustomInputType.Number && (
                                                    <input
                                                        type="number"
                                                        name={"custom_" + input.id}
                                                        id={"custom_" + input.id}
                                                        required={input.required}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder=""
                                                    />
                                                )}
                                                {input.type === EventTypeCustomInputType.Bool && (
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            type="checkbox"
                                                            name={"custom_" + input.id}
                                                            id={"custom_" + input.id}
                                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                                                            placeholder=""
                                                        />
                                                        <label
                                                            htmlFor={input.label}
                                                            className="block text-sm font-medium text-gray-700">
                                                            {input.label}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                {!["pitch-feedback", "product-feedback"].includes(props.eventType.slug) && (
                                    <div className="mb-4">
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Please share anything that will help prepare for our meeting."
                                            defaultValue={props.booking ? props.booking.description : ""}
                                        />
                                    </div>
                                )}
                                <div className="flex items-start">
                                    <Button type="submit" loading={loading} className="btn btn-primary">
                                        {rescheduleUid ? "Reschedule" : "Confirm"}
                                    </Button>
                                    <Link
                                        href={
                                            "/" +
                                            props.user.username +
                                            "/" +
                                            props.eventType.slug +
                                            (rescheduleUid ? "?rescheduleUid=" + rescheduleUid : "")
                                        }>
                                        <a className="ml-2 btn btn-white">Cancel</a>
                                    </Link>
                                </div>
                            </form>
                            {error && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <ExclamationIcon
                                                className="h-5 w-5 text-yellow-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Could not {rescheduleUid ? "reschedule" : "book"} the meeting.
                                                Please try again or{" "}
                                                <a
                                                    href={"mailto:" + props.user.email}
                                                    className="font-medium underline text-yellow-700 hover:text-yellow-600">
                                                    Contact {props.user.name} via e-mail
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const user = await prisma.user.findFirst({
        where: {
            username: context.query.user,
        },
        select: {
            username: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            eventTypes: true,
        },
    });

    const eventType = await prisma.eventType.findUnique({
        where: {
            id: parseInt(context.query.type),
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            length: true,
            locations: true,
            customInputs: true,
        },
    });

    let booking = null;

    if (context.query.rescheduleUid) {
        booking = await prisma.booking.findFirst({
            where: {
                uid: context.query.rescheduleUid,
            },
            select: {
                description: true,
                attendees: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }

    return {
        props: {
            user,
            eventType,
            booking,
        },
    };
}
