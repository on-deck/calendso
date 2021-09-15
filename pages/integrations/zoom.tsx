export default function Zoom() {
    return (
        <main className="max-w-2xl mx-auto my-24 pb-24">
            <h1 className="antialiased font-raleway mt-12 sm:mt-24 text-[44px] sm:text-6xl">
                Zoom integration
            </h1>

            <h2 className="antialiased text-[24px] leading-[32px] font-bold font-raleway mt-6">
                Installation
            </h2>
            <p className="antialiased font-raleway text-[21px] leading-[30px] mt-6">
                Follow these steps to add Zoom integration to your On Deck Calendso account:
                <ol className="list-decimal space-y-2 mt-4 ml-8 block">
                    <li className="list-inside">Open &apos;Integrations&apos; tab</li>
                    <li className="list-inside">Select &apos;Add new integration&apos;</li>
                    <li className="list-inside">In the modal select &apos;Zoom Video Conferencing&apos;</li>
                    <li className="list-inside">
                        Follow the prompts to install Zoom integration. Make sure you read the permissions
                        you&apos;re giving to the On Deck application carefully. On Deck application will be
                        able to schedule meetings on your behalf and see your profile information.
                    </li>
                </ol>
            </p>

            <h2 className="antialiased text-[24px] leading-[32px] font-bold font-raleway mt-6">Usage</h2>
            <p className="antialiased font-raleway text-[21px] leading-[30px] mt-6">
                On Deck will be using the Zoom integration in the background every time a Fellow schedules a
                call with you to automatically create a matching Zoom meeting.
            </p>
            <p className="antialiased font-raleway text-[21px] leading-[30px] mt-6">
                You will be able to access this meeting in the Zoom application, or on Zoom website. In the
                near future we will also start attaching meeting links to calendar invites and email
                notifications.
            </p>

            <h2 className="antialiased text-[24px] leading-[32px] font-bold font-raleway mt-6">
                Uninstallation
            </h2>
            <p className="antialiased font-raleway text-[21px] leading-[30px] mt-6">
                Follow these steps to remove Zoom integration from your On Deck Calendso account and uninstall
                the On Deck application from your Zoom account:
                <ol className="list-decimal space-y-2 mt-4 ml-8 block">
                    <li className="list-inside">Open &apos;Integrations&apos; tab</li>
                    <li className="list-inside">Select the existing Zoom integration</li>
                    <li className="list-inside">
                        On the integration page select &apos;Delete integration&apos;
                    </li>
                    <li className="list-inside">
                        Login to your Zoom account and navigate to the Zoom App Marketplace
                    </li>
                    <li className="list-inside">
                        Click &apos;Manage&apos; &gt; &apos;Installed Apps&apos; or search for the &apos;On
                        Deck&apos; app
                    </li>
                    <li className="list-inside">Click the &apos;On Deck&apos; app</li>
                    <li className="list-inside">Click &apos;Uninstall&apos;</li>
                </ol>
            </p>
        </main>
    );
}
