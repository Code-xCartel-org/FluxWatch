import {useMemo, useState} from "react";
import {Check, Copy, Eye, EyeOff, Loader2} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {useSignOutMutation, useGetSessionsQuery} from "@/services/authApi";
import {logout} from "@/store/slices/authSlice";
import {eraseCookie} from "@/utils/cookies";
import {HEADERS} from "@/constants/headers";
import {useGetSelfQuery} from "@/services/accountApi";
import {useGenerateApiKeyMutation, useGetApiKeyQuery} from "@/services/keysApi";
import {SessionRow} from "@/components/session-row";
import {ChangePasswordForm} from "@/components/change-password-form";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {RootState} from "@/store/store";
import type {Session} from "@/models/auth";

function maskKey(key: string) {
    return "•".repeat(key.length);
}

export default function AccountSettings() {
    const {token, ttl} = useSelector((state: RootState) => state.auth);
    const {data: user} = useGetSelfQuery();
    const [signOut, {isLoading: isLoggingOut}] = useSignOutMutation();
    const {data: apiKeyInfo, isLoading: isLoadingKey, isSuccess: isKeyLoaded} = useGetApiKeyQuery();
    const [generateKey, {isLoading: isGenerating}] = useGenerateApiKeyMutation();
    const {data: sessionsData, isLoading: isLoadingSessions} = useGetSessionsQuery();
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const dispatch = useDispatch();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const hasKey = isKeyLoaded && !!apiKeyInfo;

    const currentSession = useMemo<Session | null>(() => {
        if (!token) return null;
        try {
            const decoded = atob(token);
            const sessionId = decoded.split(":")[0];
            return {id: sessionId, createdAt: "", updatedAt: "", ttl: ttl ?? null};
        } catch {
            return null;
        }
    }, [token, ttl]);

    const handleLogoutAll = async () => {
        try {
            await signOut({scope: "all"}).unwrap();
        } catch (err) {
            console.error("Logout all sessions failed:", err);
        }
    };

    const handleGenerateKey = async () => {
        try {
            const result = await generateKey().unwrap();
            setGeneratedKey(result.key);
            setCopied(false);
            setRevealed(false);
        } catch (err) {
            console.error("API key generation failed:", err);
        }
    };

    const handleCopy = async () => {
        if (!generatedKey) return;
        await navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-6 md:p-8">
            <h1 className="text-xl font-semibold sm:text-2xl">Account</h1>

            <div className="mt-6 sm:mt-8">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-end gap-3">
                        <div>
                            <span className="text-sm">API key</span>
                            {isLoadingKey ? (
                                <p className="text-muted-foreground mt-0.5 text-xs">Loading...</p>
                            ) : apiKeyInfo ? (
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    Created On {new Date(apiKeyInfo.createdAt).toLocaleDateString()}
                                </p>
                            ) : (
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    No API key generated
                                </p>
                            )}
                        </div>
                        {!isLoadingKey && apiKeyInfo && (
                            <span
                                className={`inline-flex items-center rounded-sm border-2 px-2 py-0.5 text-xs font-medium ${
                                    apiKeyInfo.isActive
                                        ? "border-green-600/25 bg-green-500/10 text-green-600 dark:border-green-400/25 dark:text-green-400"
                                        : "border-destructive/25 bg-destructive/10 text-destructive"
                                }`}
                            >
                                {apiKeyInfo.isActive ? "Active" : "Inactive"}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleGenerateKey}
                        disabled={isGenerating}
                        className="hover:bg-accent inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium disabled:opacity-50"
                    >
                        {isGenerating && <Loader2 className="size-3.5 animate-spin" />}
                        {hasKey ? "Regenerate" : "Generate"}
                    </button>
                </div>

                <div className="flex items-center justify-between py-4">
                    <span className="text-sm">Change password</span>
                    <button
                        onClick={() => setChangePasswordOpen(true)}
                        className="hover:bg-accent inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-4 text-sm font-medium"
                    >
                        Change
                    </button>
                </div>

                <div className="flex items-center justify-between border-b py-4">
                    <span className="text-sm">Log out of all devices</span>
                    <button
                        onClick={handleLogoutAll}
                        disabled={isLoggingOut}
                        className="hover:bg-accent inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium disabled:opacity-50"
                    >
                        {isLoggingOut && <Loader2 className="size-3.5 animate-spin" />}
                        Log out
                    </button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold">Active sessions</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-muted-foreground border-b text-xs font-medium">
                                <th className="py-2 pr-4 font-medium">Session</th>
                                <th className="py-2 pr-4 font-medium">Expires in</th>
                                <th className="py-2 text-right font-medium" />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingSessions ? (
                                <tr>
                                    <td colSpan={3} className="py-3">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="size-4 animate-spin" />
                                            <span className="text-muted-foreground text-sm">
                                                Loading sessions...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {currentSession && (
                                        <SessionRow
                                            session={currentSession}
                                            principal={user?.principal ?? ""}
                                            isCurrent
                                        />
                                    )}
                                    {sessionsData?.sessions.map((session) => (
                                        <SessionRow
                                            key={session.id}
                                            session={session}
                                            principal={user?.principal ?? ""}
                                        />
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Change Password Dialog */}
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-md">
                    <ChangePasswordForm
                        onSuccess={() => {
                            setChangePasswordOpen(false);
                            setPasswordChanged(true);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Password Changed Alert */}
            <AlertDialog open={passwordChanged}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Password updated</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your password has been changed. Please sign in again to verify your new
                            credentials.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                eraseCookie(HEADERS.AUTH_TOKEN);
                                dispatch(logout());
                            }}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* API Key Dialog */}
            <AlertDialog
                open={!!generatedKey}
                onOpenChange={(open) => {
                    if (!open) setGeneratedKey(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Your API key</AlertDialogTitle>
                        <AlertDialogDescription>
                            Copy this key now. You won't be able to see it again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <code className="bg-muted flex-1 truncate rounded-md px-3 py-2 font-mono text-sm">
                            {revealed ? generatedKey : maskKey(generatedKey ?? "")}
                        </code>
                        <button
                            onClick={() => setRevealed(!revealed)}
                            className="hover:bg-accent inline-flex size-9 shrink-0 items-center justify-center rounded-md border"
                        >
                            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="hover:bg-accent inline-flex size-9 shrink-0 items-center justify-center rounded-md border"
                        >
                            {copied ? (
                                <Check className="size-4 text-green-500" />
                            ) : (
                                <Copy className="size-4" />
                            )}
                        </button>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setGeneratedKey(null)}>
                            Done
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
