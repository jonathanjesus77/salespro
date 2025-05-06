"use client"

import Link from "next/link"
import { Briefcase, Package, ShoppingCart, Users, Truck, LayoutDashboard, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function MainNav() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "US"

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">SalesPro</span>
      </div>
      <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link href="/vendas" className="flex items-center gap-2 font-medium">
          <ShoppingCart className="h-4 w-4" />
          Vendas
        </Link>
        <Link href="/estoque" className="flex items-center gap-2 font-medium">
          <Package className="h-4 w-4" />
          Estoque
        </Link>
        <Link href="/clientes" className="flex items-center gap-2 font-medium">
          <Users className="h-4 w-4" />
          Clientes
        </Link>
        <Link href="/fornecedores" className="flex items-center gap-2 font-medium">
          <Truck className="h-4 w-4" />
          Fornecedores
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
