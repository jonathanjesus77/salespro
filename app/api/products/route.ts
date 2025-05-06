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

    const products = await prisma.product.findMany({
      include: {
        supplier: true,
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
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

    const product = await prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        price: Number.parseFloat(data.price),
        stock: Number.parseInt(data.stock),
        category: data.category,
        supplierId: data.supplierId,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
