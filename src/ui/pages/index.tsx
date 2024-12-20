import * as Pages from "./pages";

import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";

import { isInDevEnvironment } from "@/background/webapi/browser";

const PageRoutes: Array<{ path: string; component: React.FC<{}> }> = [
    {
        path: "/",
        component: Pages.Home,
    },
    {
        path: "/wallet",
        component: Pages.WalletDashboard,
    },
    {
        path: "/unlock-wallet",
        component: Pages.UnlockWallet,
    },
    {
        path: "/create-wallet",
        component: Pages.CreateWalletNewSeedphrase,
    },
    {
        path: "/import-wallet",
        component: Pages.CreateWalletImportSeedphrase,
    },
];

export const Router = () => {
    const isDev = isInDevEnvironment();
    const PolymorphicRouter = isDev ? BrowserRouter : HashRouter;

    return (
        <PolymorphicRouter>
            <Routes>
                {PageRoutes.map((Page, index) => {
                    return <Route key={index} path={Page.path} element={<Page.component />} />;
                })}
            </Routes>
        </PolymorphicRouter>
    );
};
