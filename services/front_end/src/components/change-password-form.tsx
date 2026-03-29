import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckCircle} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {AppPasswordField} from "@/components/form-fields/app-password-filed";
import {AppFormWrapper} from "@/components/form-fields/app-form-wrapper";
import {type ChangePasswordFormValues, changePasswordSchema} from "@/schemas/auth";
import {useChangePasswordMutation} from "@/services/authApi";
import type {ReactNode} from "react";

interface ChangePasswordFormProps {
    token?: string;
    onSuccess?: () => void;
    successAction?: ReactNode;
}

export function ChangePasswordForm({token, onSuccess, successAction}: ChangePasswordFormProps) {
    const [changePassword, {isLoading, isSuccess, error}] = useChangePasswordMutation();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {password: "", confirmPassword: ""},
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await changePassword({
                password: values.password,
                ...(token && {token}),
            }).unwrap();
            onSuccess?.();
        } catch (err) {
            console.error("Change password failed:", err);
        }
    });

    if (isSuccess) {
        return (
            <Card className="border-muted w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Password changed</CardTitle>
                    <CardDescription>Your password has been updated successfully</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-4">
                    <CheckCircle className="text-primary size-12" />
                    {successAction}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-muted w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Change password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
                <AppFormWrapper
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    error={error}
                    buttonText="Change password"
                >
                    <AppPasswordField
                        name="password"
                        label="New Password"
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
        </Card>
    );
}
