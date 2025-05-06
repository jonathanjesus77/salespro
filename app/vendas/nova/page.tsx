"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { useToast } from "@/hooks/use-toast"

export default function NovaVendaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [clientId, setClientId] = useState("")
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }])
  const [clients, setClients] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Buscar clientes e produtos ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [clientsRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`)

        ])

        if (clientsRes.ok && productsRes.ok) {
          const clientsData = await clientsRes.json()
          const productsData = await productsRes.json()

          setClients(clientsData)
          setProducts(productsData)
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      }
    }

    fetchData()
  }, [])

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value

    if (field === "productId") {
      const product = products.find((p) => p.id === value)
      if (product) {
        newItems[index].price = product.price
      }
    }

    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const saleCode = `VND-${Date.now().toString().slice(-6)}`

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: saleCode,
          clientId,
          total: calculateTotal(),
          items: items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        })
      })

      if (response.ok) {
        toast({
          title: "Venda registrada com sucesso",
          description: `Venda ${saleCode} foi registrada com sucesso.`
        })
        router.push("/vendas")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erro ao registrar venda")
      }
    } catch (error: any) {
      toast({
        title: "Erro ao registrar venda",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainNav />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/vendas">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg md:text-2xl">Nova Venda</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nova Venda</CardTitle>
              <CardDescription>Preencha os dados para registrar uma nova venda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Select value={clientId} onValueChange={setClientId} required>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Itens da Venda</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    Adicionar Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`product-${index}`}>Produto</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => handleItemChange(index, "productId", value)}
                        required
                      >
                        <SelectTrigger id={`product-${index}`}>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - R$ {product.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`quantity-${index}`}>Qtd</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`price-${index}`}>Preço</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total da Venda</p>
                  <p className="text-2xl font-bold">R$ {calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/vendas">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isLoading || items.some((item) => !item.productId) || !clientId}>
                {isLoading ? "Registrando..." : "Registrar Venda"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
