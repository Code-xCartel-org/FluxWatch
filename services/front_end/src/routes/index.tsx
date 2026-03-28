import {createBrowserRouter, Navigate, RouterProvider} from "react-router";
import {GuestRoute, PrivateRoute, PublicRoute} from "@/routes/guard.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";
import {APP_ROUTE} from "@/constants/routes.ts";
import Login from "@/pages/auth/login.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import SettingsLayout from "@/layouts/SettingsLayout.tsx";
import Events from "@/pages/events";
import Register from "@/pages/auth/register.tsx";
import Activate from "@/pages/auth/activate.tsx";
import AccountSettings from "@/pages/settings/account.tsx";

const Routes = () => {
    const router = createBrowserRouter([
        {
            Component: RootLayout,
            children: [
                // GUEST-ROUTES (redirect to home if already logged in)
                {
                    Component: GuestRoute,
                    children: [
                        {
                            path: APP_ROUTE.LOGIN,
                            Component: Login,
                        },
                        {
                            path: APP_ROUTE.REGISTER,
                            Component: Register,
                        },
                    ],
                },

                // PUBLIC-ROUTES (accessible by anyone)
                {
                    Component: PublicRoute,
                    children: [
                        {
                            path: APP_ROUTE.ACTIVATE,
                            Component: Activate,
                        },
                    ],
                },

                // PROTECTED-ROUTES
                {
                    Component: PrivateRoute,
                    children: [
                        {
                            Component: AuthLayout,
                            children: [
                                {
                                    path: APP_ROUTE.HOMEPAGE,
                                    Component: Events,
                                },
                                {
                                    Component: SettingsLayout,
                                    children: [
                                        {
                                            path: APP_ROUTE.SETTINGS,
                                            element: (
                                                <Navigate to={APP_ROUTE.SETTINGS_ACCOUNT} replace />
                                            ),
                                        },
                                        {
                                            path: APP_ROUTE.SETTINGS_ACCOUNT,
                                            Component: AccountSettings,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
