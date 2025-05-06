// This file is specifically for Vercel deployment
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance each time
// This is necessary for Vercel's serverless functions
const prisma = new PrismaClient()

export default prisma
