import Analytics from "analytics-node";

export const analytics = new Analytics(process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY);

export enum AnalyticsTrackingEvent {
    BookingCancelled = "bookingCancelled",
    BookingConfirmed = "bookingConfirmed",
    LoginFirstTime = "loginFirstTime",
    LoginSuccess = "loginSuccess",
    LoginNotAllowed = "loginNotAllowed",
    DateSelected = "dateSelected",
    TimeSelected = "timeSelected",
}
