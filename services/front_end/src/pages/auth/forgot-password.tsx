import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link} from "react-router";
import {Mail} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {AppTextField} from "@/components/form-fields/app-text-field";
import {AppFormWrapper} from "@/components/form-fields/app-form-wrapper";
import {type ForgotPasswordFormValues, forgotPasswordSchema} from "@/schemas/auth";
import {useForgotPasswordMutation} from "@/services/authApi";
import {APP_ROUTE} from "@/constants/routes";

export default function ForgotPassword() {
    const [forgotPassword, {isLoading, error}] = useForgotPasswordMutation();
    const [sent, setSent] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {email: ""},
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await forgotPassword(values).unwrap();
            setSent(true);
        } catch (err) {
            console.error("Forgot password failed:", err);
        }
    });

    return (
        <div className="bg-muted/40 flex min-h-screen w-full items-center justify-center p-4">
            <Card className="border-muted w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        {sent ? "Check your email" : "Forgot password"}
                    </CardTitle>
                    <CardDescription>
                        {sent
                            ? "We've sent a password reset link to your email"
                            : "Enter your email and we'll send you a reset link"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {sent ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <Mail className="text-muted-foreground size-12" />
                            <p className="text-muted-foreground text-center text-sm">
                                If an account exists with that email, you'll receive a password
                                reset link shortly.
                            </p>
                        </div>
                    ) : (
                        <AppFormWrapper
                            onSubmit={onSubmit}
                            isLoading={isLoading}
                            error={error}
                            buttonText="Send reset link"
                        >
                            <AppTextField
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="name@example.com"
                                control={form.control}
                                disabled={isLoading}
                            />
                        </AppFormWrapper>
                    )}
                </CardContent>

                <CardFooter className="text-muted-foreground flex flex-wrap items-center justify-center gap-1 text-sm">
                    <Link to={APP_ROUTE.LOGIN} className="text-primary font-medium hover:underline">
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
