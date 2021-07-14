import Analytics from "analytics-node";

export const serverAnalytics = new Analytics(process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY);

export enum AnalyticsTrackingEvent {
    UserPageOpened = "scheduleUserPageOpened",
    BookingPageOpened = "scheduleBookingPageOpened",
    BookingCancelled = "scheduleBookingCancelled",
    BookingConfirmed = "scheduleBookingConfirmed",
    LoginFirstTime = "scheduleLoginFirstTime",
    LoginSuccess = "scheduleLoginSuccess",
    LoginNotAllowed = "scheduleLoginNotAllowed",
    DateSelected = "scheduleDateSelected",
    TimeSelected = "scheduleTimeSelected",
}
