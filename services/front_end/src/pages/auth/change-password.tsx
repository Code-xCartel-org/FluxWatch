import {Link, Navigate, useSearchParams, useNavigate} from "react-router";
import {CardFooter} from "@/components/ui/card";
import {ChangePasswordForm} from "@/components/change-password-form";
import {APP_ROUTE} from "@/constants/routes";

export default function ChangePassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("t");
    const navigate = useNavigate();

    if (!token) return <Navigate to={APP_ROUTE.HOMEPAGE} replace />;

    return (
        <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-md">
                <ChangePasswordForm
                    token={token}
                    successAction={
                        <button
                            onClick={() => navigate(APP_ROUTE.LOGIN)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-6 text-sm font-medium"
                        >
                            Go to Login
                        </button>
                    }
                />
                <CardFooter className="text-muted-foreground mt-2 flex flex-wrap items-center justify-center gap-1 text-sm">
                    <Link to={APP_ROUTE.LOGIN} className="text-primary font-medium hover:underline">
                        Back to Login
                    </Link>
                </CardFooter>
            </div>
        </div>
    );
}
