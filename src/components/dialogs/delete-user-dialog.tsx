"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { User } from "@/types/database";
import { toast } from "sonner";
import { useSessionState } from "@/lib/hooks/use-session-state";
import { cn } from "@/lib/utils";

interface DeleteUserDialogProps {
    user: User;
}

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { session } = useSessionState();

    const isCurrentUser = session?.user?.id === user.id;

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete user");
            }

            toast.success(`${user.name} deleted successfully`);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to delete ${user.name}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} disabled={isCurrentUser}>
                <TrashIcon
                    className={cn("h-4 w-4", isCurrentUser ? "text-muted-foreground" : "text-red-500")}
                />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the user &quot;{user.name}
                            &quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
