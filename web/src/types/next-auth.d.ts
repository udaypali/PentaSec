import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            imageCount?: number
            reportCount?: number
        } & DefaultSession["user"]
    }
}
