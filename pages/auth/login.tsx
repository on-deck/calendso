import Head from "next/head";
import SignInWithOnDeck from "../../components/ui/SignInWithOnDeck";

export default function Login() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 mx-2 shadow rounded-lg sm:px-10 flex justify-center">
                    <SignInWithOnDeck />
                </div>
            </div>
        </div>
    );
}
