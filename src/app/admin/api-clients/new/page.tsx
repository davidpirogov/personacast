"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const DisplayTokenCard = ({ token, onProceed }: { token: string; onProceed: () => void }) => {
    return (
        <Card className="w-full mx-auto mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    Save Your API Token
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 mb-2">
                        Please save this token securely. You won't be able to see it again!
                    </p>
                    <div className="p-3 bg-white border border-amber-300 rounded font-mono text-sm break-all">
                        {token}
                    </div>
                </div>
                <div className="p-4 border border-green-200 rounded-lg">
                    Test your token with curl:
                    <div className="text-sm bg-gray-100 p-2 rounded-lg">
                        <pre>
                            curl -X GET "http://localhost:3000/api/api-clients" \<br />
                            -H "Authorization: Bearer {token}"
                        </pre>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onProceed}>Proceed</Button>
            </CardFooter>
        </Card>
    );
};

export default function NewApiClientPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [token, setToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/api-clients", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.client.token);
        } else {
            console.error("Failed to create API client");
        }
    };

    const handleProceed = () => {
        router.push("/admin/api-clients");
    };

    if (token) {
        return (
            <main className="container mx-auto max-w-5xl p-6">
                <DisplayTokenCard token={token} onProceed={handleProceed} />
            </main>
        );
    }

    return (
        <main className="container mx-auto mt-32 p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>New API Client</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/api-clients")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create Client</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
