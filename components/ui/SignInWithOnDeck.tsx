import classNames from "classnames";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback } from "react";
import OnDeckLogo from "./OnDeckLogo";

export default function Button({ className }) {
    const { replace } = useRouter();
    const [user] = useSession();

    const handleSignIn = useCallback((event: FormEvent) => {
        event.preventDefault();
        signIn("auth0", { redirect: false });
    }, []);

    if (typeof window !== "undefined" && user) {
        replace("/");
        return null;
    }

    return (
        <button
            type="submit"
            className={classNames(
                "btn bg-ondeck text-white flex rounded-full font-inter text-[15px] leading-[22px] font-semibold h-10 items-center py-3 px-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ondeck",
                className
            )}
            onClick={handleSignIn}>
            <OnDeckLogo className="text-white w-4 h-4" />
            <span className="ml-2">Sign In with On Deck</span>
        </button>
    );
}
