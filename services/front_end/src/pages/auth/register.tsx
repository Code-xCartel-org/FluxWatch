import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useNavigate} from "react-router";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AppTextField} from "@/components/form-fields/app-text-field";
import {AppPasswordField} from "@/components/form-fields/app-password-filed";
import {AppFormWrapper} from "@/components/form-fields/app-form-wrapper";
import {type RegisterFormValues, registerSchema} from "@/schemas/auth";
import {useRegisterMutation} from "@/services/authApi";
import {APP_ROUTE} from "@/constants/routes";

export default function Register() {
    const navigate = useNavigate();
    const [register, {isLoading, error}] = useRegisterMutation();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await register(values).unwrap();
            navigate(APP_ROUTE.LOGIN);
        } catch (err) {
            console.error("Registration failed:", err);
        }
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
                            name="username"
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
        </div>
    );
}
