import {NavLink, Outlet} from "react-router";
import {User} from "lucide-react";
import {APP_ROUTE} from "@/constants/routes";
import {cn} from "@/lib/utils";

const settingsNav = [{title: "Account", icon: User, path: APP_ROUTE.SETTINGS_ACCOUNT}];

export default function SettingsLayout() {
    return (
        <div className="flex h-full flex-col md:flex-row">
            <aside className="shrink-0 border-b px-4 py-4 md:w-52 md:border-b-0 md:py-6 md:pr-2 md:pl-6">
                <h2 className="mb-3 text-2xl font-semibold italic md:mb-4">Settings</h2>
                <nav className="flex gap-1 md:flex-col md:space-y-1">
                    {settingsNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({isActive}) =>
                                cn(
                                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                )
                            }
                        >
                            <item.icon className="size-4" />
                            {item.title}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
