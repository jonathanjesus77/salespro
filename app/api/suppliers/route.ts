import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const suppliers = await prisma.supplier.findMany()

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error)
    return NextResponse.json({ error: "Erro ao buscar fornecedores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "ESTOQUISTA") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const data = await request.json()

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error)
    return NextResponse.json({ error: "Erro ao criar fornecedor" }, { status: 500 })
  }
}
