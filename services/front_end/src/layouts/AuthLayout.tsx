import type {FC} from "react";
import {Outlet} from "react-router";

const AuthLayout: FC = () => {
    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default AuthLayout