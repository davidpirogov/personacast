import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const buffer = await request.arrayBuffer();
        const resizedBuffer = await sharp(Buffer.from(buffer))
            .resize(48, 48, { fit: "cover" })
            .jpeg({ quality: 70 })
            .toBuffer();

        const base64 = resizedBuffer.toString("base64");
        return NextResponse.json({ image: `data:image/jpeg;base64,${base64}` });
    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
