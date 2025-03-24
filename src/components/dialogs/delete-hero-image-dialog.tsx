"use client";

import { HeroImage } from "@/types/database";
import { DeleteRecordDialog } from "./delete-record-dialog";

interface DeleteHeroImageDialogProps {
    heroImage: HeroImage;
}

export function DeleteHeroImageDialog({ heroImage }: DeleteHeroImageDialogProps) {
    return (
        <DeleteRecordDialog
            record={heroImage}
            title={`${heroImage.name} (${heroImage.id})`}
            description={
                <div className="text-sm text-gray-500">
                    Are you sure you want to delete this hero image? <br />
                    This action cannot be undone and this will also delete the file.
                </div>
            }
            deleteUrl={`/api/files/hero/${encodeURIComponent(heroImage.id)}`}
            onDelete={async () => {}}
        />
    );
}
