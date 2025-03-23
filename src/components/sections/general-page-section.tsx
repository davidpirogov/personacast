import React from "react";

export interface GeneralPageSectionProps {
    title: string;
    description: string;
    link?: React.ReactNode | null;
    children: React.ReactNode;
}

export interface GeneralPageSectionSkeletonProps {
    hasLink?: boolean;
    childrenCount?: number;
}

export function GeneralPageSectionSkeleton({
    hasLink = false,
    childrenCount = 3,
}: GeneralPageSectionSkeletonProps) {
    return (
        <div className="list-page-section">
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    {hasLink && <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />}
                </div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-1" />
            </div>
            <div className="space-y-4">
                {Array.from({ length: childrenCount }).map((_, index) => (
                    <div key={index} className="h-20 bg-gray-200 rounded animate-pulse" />
                ))}
            </div>
        </div>
    );
}

export default async function GeneralPageSection({
    title,
    description,
    link = null,
    children,
}: GeneralPageSectionProps) {
    return (
        <div className="list-page-section mt-16">
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl">
                        <span className="font-light">{title}</span>
                    </h1>
                    {link}
                </div>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );
}
