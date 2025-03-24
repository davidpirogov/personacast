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
import { toast } from "sonner";

interface DeleteRecordDialogProps<T> {
    record: T;
    title: string;
    description?: string | JSX.Element | null;
    deleteUrl: string;
    onDelete: (record: T) => Promise<void>;
}

export function DeleteRecordDialog<T>({
    record,
    title,
    deleteUrl,
    onDelete,
    description = null,
}: DeleteRecordDialogProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const displayedDescription =
        description ?? `Are you sure you want to delete the "${title}"? This action cannot be undone.`;

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(deleteUrl, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Failed to delete ${title}`);
            }

            toast.success(`'${title}' deleted successfully`);
            setIsOpen(false);
            router.refresh();
            await onDelete(record);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to delete '${title}'`);
        } finally {
            setIsDeleting(false);
        }
    };

    const maxLengthTitle = 48;
    const displayedTitle = title.length > maxLengthTitle ? `${title.slice(0, maxLengthTitle)}...` : title;

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
                <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader className="space-y-2 overflow-hidden">
                        <DialogTitle className="break-words pr-6">{displayedTitle}</DialogTitle>
                        <DialogDescription className="break-words whitespace-pre-wrap">
                            {displayedDescription}
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
