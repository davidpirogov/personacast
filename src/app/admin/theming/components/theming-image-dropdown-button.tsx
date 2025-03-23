"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Upload, Link } from "lucide-react";
import { useRef } from "react";
import { useThemingImage } from "../context/theming-image-context";
import { formatBytes } from "@/lib/utils";

interface ThemingImageDropdownButtonProps {
    onUrlClick: () => void;
}

export function ThemingImageDropdownButton({ onUrlClick }: ThemingImageDropdownButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { onUpload, isLoading } = useThemingImage();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUpload(file);
        }
        // Reset the input value to allow selecting the same file again
        event.target.value = "";
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="flex w-full items-center gap-1">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                <Button variant="default" className="flex-1" onClick={handleUploadClick} disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="px-2" disabled={isLoading}>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleUploadClick}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onUrlClick}>
                            <Link className="mr-2 h-4 w-4" />
                            Load from URL
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="w-full text-center text-sm text-gray-500">
                Recommended size: 2560×1440px (2K) or 3840×2160px (4K). Max file size:{" "}
                {formatBytes(Number(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE))}
            </div>
        </div>
    );
}
