import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

async function main() {
  // Limpar banco de dados
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log("🗑️ Banco de dados limpo")

  // Criar usuários
  const adminPassword = await hash("admin123", 10)
  const vendedorPassword = await hash("vendedor123", 10)
  const estoquistaPassword = await hash("estoquista123", 10)
  const caixaPassword = await hash("caixa123", 10)

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@salespro.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  const vendedor = await prisma.user.create({
    data: {
      name: "Vendedor",
      email: "vendedor@salespro.com",
      password: vendedorPassword,
      role: "VENDEDOR",
    },
  })

  const estoquista = await prisma.user.create({
    data: {
      name: "Estoquista",
      email: "estoquista@salespro.com",
      password: estoquistaPassword,
      role: "ESTOQUISTA",
    },
  })

  const caixa = await prisma.user.create({
    data: {
      name: "Caixa",
      email: "caixa@salespro.com",
      password: caixaPassword,
      role: "CAIXA",
    },
  })

  console.log("👤 Usuários criados")

  // Criar fornecedores
  const fornecedor1 = await prisma.supplier.create({
    data: {
      name: "Fornecedor A",
      contact: "João Silva",
      email: "contato@fornecedora.com",
      phone: "(11) 98765-4321",
      address: "Rua A, 123",
    },
  })

  const fornecedor2 = await prisma.supplier.create({
    data: {
      name: "Fornecedor B",
      contact: "Maria Souza",
      email: "contato@fornecedorb.com",
      phone: "(11) 91234-5678",
      address: "Rua B, 456",
    },
  })

  console.log("🏭 Fornecedores criados")

  // Criar produtos
  const produto1 = await prisma.product.create({
    data: {
      code: "PRD-001",
      name: "Notebook Dell",
      description: "Notebook Dell Inspiron 15",
      price: 3500.0,
      stock: 10,
      category: "Eletrônicos",
      supplierId: fornecedor1.id,
    },
  })

  const produto2 = await prisma.product.create({
    data: {
      code: "PRD-002",
      name: "Monitor LG",
      description: "Monitor LG 24 polegadas",
      price: 1200.0,
      stock: 15,
      category: "Eletrônicos",
      supplierId: fornecedor1.id,
    },
  })

  const produto3 = await prisma.product.create({
    data: {
      code: "PRD-003",
      name: "Teclado Logitech",
      description: "Teclado sem fio Logitech",
      price: 150.0,
      stock: 30,
      category: "Periféricos",
      supplierId: fornecedor2.id,
    },
  })

  const produto4 = await prisma.product.create({
    data: {
      code: "PRD-004",
      name: "Mouse Logitech",
      description: "Mouse sem fio Logitech",
      price: 80.0,
      stock: 40,
      category: "Periféricos",
      supplierId: fornecedor2.id,
    },
  })

  console.log("📦 Produtos criados")

  // Criar clientes
  const cliente1 = await prisma.client.create({
    data: {
      name: "Cliente 1",
      email: "cliente1@exemplo.com",
      phone: "(11) 91111-1111",
      address: "Rua Cliente 1, 111",
      city: "São Paulo",
      state: "SP",
    },
  })

  const cliente2 = await prisma.client.create({
    data: {
      name: "Cliente 2",
      email: "cliente2@exemplo.com",
      phone: "(11) 92222-2222",
      address: "Rua Cliente 2, 222",
      city: "Rio de Janeiro",
      state: "RJ",
    },
  })

  console.log("👥 Clientes criados")

  // Criar vendas
  const venda1 = await prisma.sale.create({
    data: {
      code: "VND-001",
      date: new Date(),
      total: 3650.0,
      clientId: cliente1.id,
      userId: vendedor.id,
      items: {
        create: [
          {
            quantity: 1,
            price: 3500.0,
            productId: produto1.id,
          },
          {
            quantity: 1,
            price: 150.0,
            productId: produto3.id,
          },
        ],
      },
    },
  })

  const venda2 = await prisma.sale.create({
    data: {
      code: "VND-002",
      date: new Date(),
      total: 1280.0,
      clientId: cliente2.id,
      userId: vendedor.id,
      items: {
        create: [
          {
            quantity: 1,
            price: 1200.0,
            productId: produto2.id,
          },
          {
            quantity: 1,
            price: 80.0,
            productId: produto4.id,
          },
        ],
      },
    },
  })

  console.log("💰 Vendas criadas")

  // Atualizar estoque
  await prisma.product.update({
    where: { id: produto1.id },
    data: { stock: 9 },
  })

  await prisma.product.update({
    where: { id: produto2.id },
    data: { stock: 14 },
  })

  await prisma.product.update({
    where: { id: produto3.id },
    data: { stock: 29 },
  })

  await prisma.product.update({
    where: { id: produto4.id },
    data: { stock: 39 },
  })

  console.log("✅ Estoque atualizado")

  console.log("🌱 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
