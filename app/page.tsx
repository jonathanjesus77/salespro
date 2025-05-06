import { BarChart3, Package, Users, Truck, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { executeQuery } from "@/lib/db"
import { MainNav } from "@/components/main-nav"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch dashboard data
  const [
    productsCountResult,
    clientsCountResult,
    suppliersCountResult,
    salesResult,
    newClientsThisMonthResult,
    newProductsThisMonthResult,
    newSuppliersThisMonthResult,
  ] = await Promise.all([
    executeQuery('SELECT COUNT(*) as count FROM "Product"'),
    executeQuery('SELECT COUNT(*) as count FROM "Client"'),
    executeQuery('SELECT COUNT(*) as count FROM "Supplier"'),
    executeQuery('SELECT * FROM "Sale" WHERE status = $1', ["CONCLUIDA"]),
    executeQuery('SELECT COUNT(*) as count FROM "Client" WHERE "createdAt" >= date_trunc(\'month\', CURRENT_DATE)'),
    executeQuery('SELECT COUNT(*) as count FROM "Product" WHERE "createdAt" >= date_trunc(\'month\', CURRENT_DATE)'),
    executeQuery('SELECT COUNT(*) as count FROM "Supplier" WHERE "createdAt" >= date_trunc(\'month\', CURRENT_DATE)'),
  ])

  const productsCount = Number.parseInt(productsCountResult[0].count)
  const clientsCount = Number.parseInt(clientsCountResult[0].count)
  const suppliersCount = Number.parseInt(suppliersCountResult[0].count)
  const sales = salesResult
  const newClientsThisMonth = Number.parseInt(newClientsThisMonthResult[0].count)
  const newProductsThisMonth = Number.parseInt(newProductsThisMonthResult[0].count)
  const newSuppliersThisMonth = Number.parseInt(newSuppliersThisMonthResult[0].count)

  // Calculate total sales
  const totalSales = sales.reduce((acc: number, sale: any) => acc + Number.parseFloat(sale.total), 0)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainNav />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount}</div>
              <p className="text-xs text-muted-foreground">+{newProductsThisMonth} novos produtos este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientsCount}</div>
              <p className="text-xs text-muted-foreground">+{newClientsThisMonth} novos clientes este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliersCount}</div>
              <p className="text-xs text-muted-foreground">+{newSuppliersThisMonth} novos fornecedores este mês</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] w-full">
                <BarChart3 className="h-full w-full text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Módulos do Sistema</CardTitle>
              <CardDescription>Acesse os principais módulos do SalesPro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/vendas">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Vendas
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/estoque">
                    <Package className="mr-2 h-4 w-4" />
                    Estoque
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/clientes">
                    <Users className="mr-2 h-4 w-4" />
                    Clientes
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/fornecedores">
                    <Truck className="mr-2 h-4 w-4" />
                    Fornecedores
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
