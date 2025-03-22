import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Studio",
};

export default async function StudioPage() {
    redirect("/studio/dashboard");
}
