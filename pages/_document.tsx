import Document, { Html, Head, Main, NextScript } from "next/document";
import * as snippet from "@segment/snippet";

const { NEXT_PUBLIC_SEGMENT_WRITE_KEY, NODE_ENV = "development" } = process.env;

export default class MyDocument extends Document {
    renderSnippet(): string {
        const opts = {
            apiKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
            page: true,
        };

        if (NODE_ENV === "development") {
            return snippet.max(opts);
        }

        return snippet.min(opts);
    }

    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
