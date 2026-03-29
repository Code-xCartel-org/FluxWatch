import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useSignOutMutation} from "@/services/authApi.ts";

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({open, onOpenChange}: LogoutDialogProps) {
    const [signOut, {isLoading}] = useSignOutMutation();

    const handleLogout = async () => {
        try {
            await signOut({scope: "current"}).unwrap();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign out</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to sign out?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={handleLogout}>
                        Sign out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
