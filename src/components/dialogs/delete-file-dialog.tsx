"use client";

import { FileMetadata } from "@/types/database";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteFileDialogProps {
    file: FileMetadata;
}

export function DeleteFileDialog({ file }: DeleteFileDialogProps) {
    return (
        <DeleteRecordDialog
            record={file}
            title={`${file.name} (${file.id})`}
            deleteUrl={`/api/files/${encodeURIComponent(file.id)}`}
            onDelete={async () => {}}
        />
    );
}
