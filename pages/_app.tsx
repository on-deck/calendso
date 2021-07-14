import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";

// Track client-side page views with Segment
Router.events.on("routeChangeComplete", (url) => {
    window.analytics.page(url);
});

function MyApp({ Component, pageProps }) {
    const { route } = useRouter();
    const userId = pageProps.user?.id;

    console.log(pageProps);
    useEffect(() => {
        const isBookingPage = route.startsWith("/[user]") || route.startsWith("/book");
        console.log(isBookingPage);
        if (!isBookingPage && userId && window) {
            window.analytics.identify(userId);
        }
    }, [route, userId]);

    return (
        <Provider session={pageProps.session}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
