import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Force Prisma to be generated before NextAuth is initialized
import "@prisma/client"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
