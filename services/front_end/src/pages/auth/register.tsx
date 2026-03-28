import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useNavigate} from "react-router";
import {Mail} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AppTextField} from "@/components/form-fields/app-text-field";
import {AppPasswordField} from "@/components/form-fields/app-password-filed";
import {AppFormWrapper} from "@/components/form-fields/app-form-wrapper";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {type RegisterFormValues, registerSchema} from "@/schemas/auth";
import {useRegisterMutation} from "@/services/authApi";
import {APP_ROUTE} from "@/constants/routes";

export default function Register() {
    const navigate = useNavigate();
    const [register, {isLoading, error}] = useRegisterMutation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {confirmPassword, ...rest} = values;
        await register(rest).unwrap().then(() => {
            setRegisteredEmail(values.email);
            setShowSuccess(true);
        }).catch(err => {
            console.error("Registration failed:", err);
        })
    });

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/40">
            <Card className="w-full max-w-md shadow-lg border-muted">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AppFormWrapper
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        error={error}
                        buttonText="Create Account"
                    >
                        <AppTextField
                            name="name"
                            label="Username"
                            placeholder="johndoe"
                            control={form.control}
                            disabled={isLoading}
                        />
                        <AppTextField
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            control={form.control}
                            disabled={isLoading}
                        />
                        <AppPasswordField
                            name="password"
                            label="Password"
                            control={form.control}
                            disabled={isLoading}
                        />
                        <AppPasswordField
                            name="confirmPassword"
                            label="Confirm Password"
                            control={form.control}
                            disabled={isLoading}
                        />
                    </AppFormWrapper>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
                    <span>Already have an account?</span>
                    <Link to={APP_ROUTE.LOGIN} className="text-primary font-medium hover:underline">
                        Log In
                    </Link>
                </CardFooter>
            </Card>

            <AlertDialog open={showSuccess}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia>
                            <Mail/>
                        </AlertDialogMedia>
                        <AlertDialogTitle>Check your email</AlertDialogTitle>
                        <AlertDialogDescription>
                            A verification link has been sent to <span
                            className="font-medium text-foreground">{registeredEmail}</span>. Please check your inbox
                            and click the link to activate your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => navigate(APP_ROUTE.LOGIN)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
