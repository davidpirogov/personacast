import React from "react";

export interface ListPageSectionProps {
    title: string;
    description: string;
    link?: React.ReactNode | null;
    children: React.ReactNode;
}

export default async function ListPageSection({
    title,
    description,
    link = null,
    children,
}: ListPageSectionProps) {
    return (
        <div className="list-page-section">
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
