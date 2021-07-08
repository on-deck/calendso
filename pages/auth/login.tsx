import Head from "next/head";
import Image from "next/image";
import SignInWithOnDeck from "../../components/ui/SignInWithOnDeck";

export default function Login() {
    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="h-full bg-gray-50">
                <div className="p-4 h-2/3 bg-ondeck relative flex justify-center">
                    <div className="text-center text-white max-w-xl ">
                        <h1 className="antialiased font-raleway mt-12 sm:mt-24 text-[44px] sm:text-6xl">
                            Offer Feedback
                        </h1>
                        <p className="antialiased font-raleway text-[21px] leading-[30px] mt-6">
                            Set your availability for feedback sessions in less than 5 minutes by connecting
                            your On Deck account to Calendso.
                        </p>
                        <div className="mt-12 flex justify-center items-center">
                            <div className="h-12 sm:h-16 w-28 sm:w-36">
                                <div className="absolute h-12 sm:h-16 w-28 sm:w-36">
                                    <Image src="/on-deck-white.svg" layout="fill" />
                                </div>
                            </div>
                            <div className="mx-4 w-12 h-12 rounded-full bg-white bg-opacity-20 flex justify-center items-center">
                                <Image src="/link.svg" width={24} height={24} />
                            </div>
                            <div className="h-12 sm:h-16 w-32 sm:w-40">
                                <div className="absolute h-12 sm:h-16 w-32 sm:w-40">
                                    <Image src="/calendso-white.svg" layout="fill" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative h-1/3">
                    <div className="absolute max-w-xl mx-auto -top-1/2 text-black text-left absolute inset-x-0">
                        <div className="m-4 bg-white p-10 shadow rounded-lg">
                            <h2 className="antialiased text-[24px] leading-[32px] font-bold font-raleway">
                                Sign In to Calendso
                            </h2>
                            <p className="antialiased text-[15px] leading-[21px] font-inter mt-2 font-inter">
                                You will be signed in using your On Deck account.
                            </p>
                            <SignInWithOnDeck className="mt-8" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
