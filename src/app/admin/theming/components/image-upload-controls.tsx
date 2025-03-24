"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "../context/landing-page-context";
import { ImageUploadDropzone } from "./image-upload-dropzone";
import { Input } from "@/components/ui/input";

export function ImageUploadControls() {
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [url, setUrl] = useState("");
    const { imageUpload, uploadImage, submitImageUrl, resetImageUpload } = useLandingPage();

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            await submitImageUrl(url);
            setIsUrlDialogOpen(false);
            setUrl("");
        }
    };

    return (
        <div className="space-y-4">
            {imageUpload.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{imageUpload.error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={() => document.getElementById("file-upload")?.click()}
                        variant="outline"
                        type="button"
                    >
                        Upload Image
                    </Button>
                    <Button onClick={() => setIsUrlDialogOpen(true)} variant="outline" type="button">
                        Image URL
                    </Button>
                </div>

                {/* Hidden file input for upload */}
                <ImageUploadDropzone onUpload={uploadImage} />

                {imageUpload.type !== "default" && (
                    <Button onClick={resetImageUpload} variant="ghost" size="sm" className="mt-2 self-end">
                        Reset Image
                    </Button>
                )}
            </div>

            {/* URL Dialog */}
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle>Load Image from URL</DialogTitle>
                    <DialogDescription>
                        Enter the URL of an image to use as your hero image.
                    </DialogDescription>
                    <form onSubmit={handleUrlSubmit} className="space-y-4">
                        <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsUrlDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
