"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

function LatestEpisodesContent() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-4">
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function LatestEpisodes() {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Latest Episodes</h2>
            <Suspense fallback={<Loader />}>
                <LatestEpisodesContent />
            </Suspense>
        </div>
    );
}
