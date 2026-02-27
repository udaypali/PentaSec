import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("pentasec"); // Using 'pentasec' database name
        const usersCollection = db.collection("users");

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await usersCollection.insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
