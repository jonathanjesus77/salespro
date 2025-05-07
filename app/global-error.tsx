"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Algo deu errado!</h1>
            <p className="text-lg mb-8">Ocorreu um erro inesperado no sistema.</p>
            <p className="text-sm text-muted-foreground mb-4">Código do erro: {error.digest}</p>
            <Button onClick={() => reset()}>Tentar Novamente</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
