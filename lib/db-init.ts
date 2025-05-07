import prisma from "./prisma"
import { hash } from "bcryptjs"

export async function initializeDatabase() {
  try {
    // Check if there are any users in the database
    const userCount = await prisma.user.count()

    // If there are no users, create a default admin user
    if (userCount === 0) {
      const adminPassword = await hash("admin123", 10)

      await prisma.user.create({
        data: {
          name: "Administrador",
          email: "admin@salespro.com",
          password: adminPassword,
          role: "ADMIN",
        },
      })

      console.log("Created default admin user")
    }

    return true
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return false
  }
}
