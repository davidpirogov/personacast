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
import { ApiClient } from "@/types/database";
import { toast } from "sonner";

interface DeleteApiClientDialogProps {
    client: ApiClient;
}

export function DeleteApiClientDialog({ client }: DeleteApiClientDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/api-clients/${client.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete API client");
            }

            toast.success("API client deleted successfully");
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete API client");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
                <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete API Client</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the API client &quot;{client.name}
                            &quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
