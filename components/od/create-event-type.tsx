/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const DEFAULT_AVAILABILITY = {
    dateOverrides: [],
    openingHours: [
        {
            days: [1, 2, 3, 4, 5],
            startTime: 540,
            endTime: 1080,
        },
    ],
};

export default function CreateEventTypeDropdown({ hideOnDeck, hidePitch, hideProduct, user }) {
    if (hideOnDeck && hidePitch && hideProduct) {
        return null;
    }

    async function createOnDeckFeedbackEventType(event) {
        event.preventDefault();

        const body = {
            availability: DEFAULT_AVAILABILITY,
            timeZone: user.timeZone,
            title: "On Deck Feedback",
            slug: "ondeck-feedback",
            description: `The On Deck team is here to support your journey through the program. In addition to your dedicated touchpoints on our team, other Build Partners and Build Advisors (that’s me!) volunteer a limited amount of time to help founders. If you think my background is well aligned with your needs, let’s chat!`,
            length: 30,
            hidden: false,
            minimumAdvance: 1,
            customInputs: [
                {
                    type: "textLong",
                    label: "What are you hoping to achieve or make progress on with this session (required)",
                    required: true,
                },
                {
                    type: "textLong",
                    label: "A link to any additional context that will help us make the most of our time together (optional)",
                    required: true,
                },
            ],
        };
        return request(body);
    }

    async function createPitchFeedbackEventType(event) {
        event.preventDefault();

        const body = {
            availability: DEFAULT_AVAILABILITY,
            timeZone: user.timeZone,
            title: "Pitch Feedback",
            slug: "pitch-feedback",
            description: `Get feedback on the narrative of your pitch and whether this will resonate with the investors you're seeking to bring. You'll also make a great connection within the On Deck community!`,
            length: 30,
            hidden: false,
            minimumAdvance: 1,
            customInputs: [
                {
                    type: "textLong",
                    label: "What stage are you at in your fundraising? (required)",
                    required: true,
                },
                {
                    type: "textLong",
                    label: "Help the fellow providing feedback prepare by letting them know what you hope to get out of the session (required)",
                    required: true,
                },
            ],
        };
        return request(body);
    }

    async function createProductFeedbackEventType(event) {
        event.preventDefault();

        const body = {
            availability: DEFAULT_AVAILABILITY,
            timeZone: user.timeZone,
            title: "Product Feedback",
            slug: "product-feedback",
            description: `Get feedback on your product or prototype. You'll also make a great connection within the On Deck community!`,
            length: 30,
            hidden: false,
            minimumAdvance: 1,
            customInputs: [
                {
                    type: "textLong",
                    label: "Link to your product if available",
                    required: false,
                },
                {
                    type: "textLong",
                    label: "Help the fellow providing feedback prepare by letting them know what you hope to get out of the session (required)",
                    required: true,
                },
            ],
        };
        return request(body);
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                            New event type
                            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                                {!hidePitch && (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                onClick={createPitchFeedbackEventType}
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}>
                                                Pitch Feedback
                                            </a>
                                        )}
                                    </Menu.Item>
                                )}
                                {!hideProduct && (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                onClick={createProductFeedbackEventType}
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}>
                                                Product Feedback
                                            </a>
                                        )}
                                    </Menu.Item>
                                )}

                                {!hideOnDeck && (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                onClick={createOnDeckFeedbackEventType}
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}>
                                                On Deck Feedback
                                            </a>
                                        )}
                                    </Menu.Item>
                                )}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
}

async function request(body) {
    const response = await fetch("/api/availability/eventtype", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        window.location.reload();
    }
}
