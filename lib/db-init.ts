// This file ensures Prisma is properly initialized
import prisma from "./prisma"

export { prisma }

// Export a dummy function to ensure this file is not tree-shaken
export function ensureDatabaseIsConnected() {
  return true
}
