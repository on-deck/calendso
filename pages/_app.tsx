import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Router from "next/router";

// Track client-side page views with Segment
Router.events.on("routeChangeComplete", (url) => {
    window.analytics.page(url);
});

function MyApp({ Component, pageProps }) {
    return (
        <Provider session={pageProps.session}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
