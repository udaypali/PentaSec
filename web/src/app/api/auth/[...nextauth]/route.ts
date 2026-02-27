import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise, { databaseName: "pentasec" }),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const client = await clientPromise;
                    const db = client.db("pentasec");
                    const user = await db.collection("users").findOne({ email: credentials.email });

                    if (user && await bcrypt.compare(credentials.password, user.password)) {
                        return {
                            id: user._id.toString(),
                            name: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            image: user.image || ""
                        };
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
        // newUser: '/signup' // Optional
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            // Fetch fresh user data from database
            if (token.email) {
                try {
                    const client = await clientPromise;
                    const db = client.db("pentasec");
                    const user = await db.collection("users").findOne({ email: token.email });

                    if (user) {
                        session.user = {
                            ...session.user,
                            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                            email: user.email,
                            image: user.image || session.user?.image,
                            imageCount: user.image_count || 0,
                            reportCount: user.report_count || 0
                        };
                    }
                } catch (error) {
                    console.error("Session callback error:", error);
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            // Store email in token for session callback
            if (user) {
                token.email = user.email;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
