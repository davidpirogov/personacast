"use client";

import { useState, useEffect } from "react";

const MAX_LOAD_TIME = 20;
const WARNING_TIME = 5;

export function Loader() {
    const [loadTime, setLoadTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const spinnerBorderColor =
        loadTime >= MAX_LOAD_TIME
            ? "border-red-600"
            : loadTime >= WARNING_TIME
              ? "border-amber-600"
              : "border-gray-900";

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div
                className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${spinnerBorderColor}`}
            ></div>
            {loadTime >= MAX_LOAD_TIME ? (
                <div className="text-red-600 font-medium border border-red-600 rounded-lg p-4">
                    Something definitely went wrong...
                </div>
            ) : loadTime >= WARNING_TIME ? (
                <div className="text-amber-600 font-medium border border-amber-600 rounded-lg p-4">
                    This is taking longer than expected.
                </div>
            ) : null}
        </div>
    );
}
