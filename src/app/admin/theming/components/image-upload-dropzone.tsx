"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploadDropzoneProps {
    onUpload: (file: File) => Promise<void>;
}

export function ImageUploadDropzone({ onUpload }: ImageUploadDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onUpload(acceptedFiles[0]);
            }
        },
        [onUpload],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
        },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
        >
            <input {...getInputProps()} id="file-upload" />
            <div className="flex flex-col items-center justify-center text-center">
                <Upload className={`h-10 w-10 mb-3 ${isDragActive ? "text-primary" : "text-gray-400"}`} />
                <p className="mb-1 text-sm font-medium">
                    {isDragging ? "Drop the image here" : "Drag and drop an image here"}
                </p>
                <p className="text-xs text-gray-500">or click to browse</p>
                <p className="mt-2 text-xs text-gray-400">Supported formats: JPEG, PNG, WebP, GIF</p>
            </div>
        </div>
    );
}
