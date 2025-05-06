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

    const sales = await prisma.sale.findMany({
      include: {
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error("Erro ao buscar vendas:", error)
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "VENDEDOR" && session.user.role !== "CAIXA") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const data = await request.json()

    // Iniciar uma transação para garantir a integridade dos dados
    const sale = await prisma.$transaction(async (tx) => {
      // Criar a venda
      const newSale = await tx.sale.create({
        data: {
          code: data.code,
          total: data.total,
          clientId: data.clientId,
          userId: session.user.id,
          status: data.status || "CONCLUIDA",
        },
      })

      // Adicionar os itens da venda
      for (const item of data.items) {
        // Criar o item da venda
        await tx.saleItem.create({
          data: {
            quantity: item.quantity,
            price: item.price,
            saleId: newSale.id,
            productId: item.productId,
          },
        })

        // Atualizar o estoque do produto
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return newSale
    })

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar venda:", error)
    return NextResponse.json({ error: "Erro ao criar venda" }, { status: 500 })
  }
}
