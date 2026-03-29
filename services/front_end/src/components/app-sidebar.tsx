import {useState} from "react";
import {ChevronsUpDown, Home, LogOut, Settings} from "lucide-react";
import {useLocation, useNavigate} from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {LogoutDialog} from "@/components/logout-dialog";
import {useGetSelfQuery} from "@/services/accountApi";
import {APP_ROUTE} from "@/constants/routes.ts";

const navItems = [{title: "Events", icon: Home, path: APP_ROUTE.HOMEPAGE}];

function UserInitials({name}: {name?: string}) {
    const initials = name
        ? name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "?";

    return (
        <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
            {initials}
        </div>
    );
}

export function AppSidebar() {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {data: user} = useGetSelfQuery();

    return (
        <>
            <Sidebar>
                <SidebarHeader className="px-4 py-3">
                    <span className="text-base font-semibold tracking-tight">FluxWatch</span>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            isActive={location.pathname === item.path}
                                            onClick={() => navigate(item.path)}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent"
                                    >
                                        <UserInitials name={user?.name} />
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {user?.name ?? "User"}
                                            </span>
                                            <span className="text-muted-foreground truncate text-xs">
                                                {user?.principal ?? ""}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="start"
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5">
                                            <UserInitials name={user?.name} />
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">
                                                    {user?.name ?? "User"}
                                                </span>
                                                <span className="text-muted-foreground truncate text-xs">
                                                    {user?.principal ?? ""}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => navigate(APP_ROUTE.SETTINGS_ACCOUNT)}
                                        >
                                            <Settings />
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
        </>
    );
}
