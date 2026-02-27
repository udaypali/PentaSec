import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("pentasec");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            image: user.image || "",
            imageCount: user.image_count || 0,
            reportCount: user.report_count || 0,
        }, { status: 200 });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { firstName, lastName } = await req.json();

        if (!firstName || !lastName) {
            return NextResponse.json({ message: "First and Last name are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("pentasec");
        const usersCollection = db.collection("users");

        const result = await usersCollection.updateOne(
            { email: session.user.email },
            {
                $set: {
                    firstName,
                    lastName,
                    name: `${firstName} ${lastName}` // Also update the name field for OAuth users
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db("pentasec");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ email: session.user.email });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Profile delete error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
