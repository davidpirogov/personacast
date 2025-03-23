"use client";

import { type ApiClientSchema } from "@/schemas/api-clients/schema";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteApiClientDialogProps {
    client: ApiClientSchema;
}

export function DeleteApiClientDialog({ client }: DeleteApiClientDialogProps) {
    return (
        <DeleteRecordDialog
            record={client}
            title={client.name}
            deleteUrl={`/api/api-clients/${encodeURIComponent(client.id)}`}
            onDelete={async () => {}}
        />
    );
}
