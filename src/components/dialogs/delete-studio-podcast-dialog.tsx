"use client";

import { type Podcast } from "@/types/database";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteStudioPodcastDialogProps {
    podcast: Podcast;
}

export function DeleteStudioPodcastDialog({ podcast }: DeleteStudioPodcastDialogProps) {
    return (
        <DeleteRecordDialog
            record={podcast}
            title={podcast.title}
            deleteUrl={`/api/podcasts/${encodeURIComponent(podcast.id)}`}
            onDelete={async () => {}}
        />
    );
}
