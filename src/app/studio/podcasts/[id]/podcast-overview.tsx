"use client";

import { type Podcast } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PodcastOverviewProps {
    podcast: Podcast;
}

export function PodcastOverview({ podcast }: PodcastOverviewProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Loading skeletons for episodes */}
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="flex-shrink-0">
                                <Skeleton className="h-12 w-12 rounded-md" />
                            </div>
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="flex-shrink-0 space-x-2">
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
