import {type FC} from "react";
import {Outlet} from "react-router";
import {ModeToggle} from "@/components/mode-toggle.tsx";

const RootLayout: FC = () => {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <ModeToggle/>
            <Outlet/>
        </div>
    );
}

export default RootLayout;
