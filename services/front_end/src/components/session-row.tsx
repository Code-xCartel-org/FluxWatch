import {Loader2} from "lucide-react";
import {useRevokeSessionMutation, useLogoutMutation} from "@/services/authApi";
import type {Session} from "@/models/auth";

interface SessionRowProps {
    session: Session;
    principal: string;
    isCurrent?: boolean;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export function SessionRow({session, principal, isCurrent}: SessionRowProps) {
    const [revoke, {isLoading: isRevoking}] = useRevokeSessionMutation();
    const [logout, {isLoading: isLoggingOut}] = useLogoutMutation();
    const isLoading = isCurrent ? isLoggingOut : isRevoking;

    const handleLogout = async () => {
        try {
            if (isCurrent) {
                await logout().unwrap();
            } else {
                await revoke({sessionId: session.id, principal}).unwrap();
            }
        } catch (err) {
            console.error("Session logout failed:", err);
        }
    };

    return (
        <tr className="border-b last:border-b-0">
            <td className="py-3 pr-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground truncate font-mono text-xs">
                        {session.id.slice(0, 8)}...
                    </span>
                    {isCurrent && (
                        <span className="rounded-sm border border-current/25 px-1.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                            Current
                        </span>
                    )}
                </div>
            </td>
            <td className="py-3 pr-4 text-sm">{session.ttl ? formatDate(session.ttl) : "—"}</td>
            <td className="py-3 text-right">
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="hover:bg-accent inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium disabled:opacity-50"
                >
                    {isLoading && <Loader2 className="size-3 animate-spin" />}
                    Log out
                </button>
            </td>
        </tr>
    );
}
