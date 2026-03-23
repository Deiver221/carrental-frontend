import { type ReactNode } from "react"

interface AlertaProps {
  children: ReactNode
}

export default function Alerta({ children }: AlertaProps) {
  return (
    <div className="text-center my-2 bg-red-500/30 border-2 border-red-600 text-white font-semibold p-3 rounded-lg">
      {children}
    </div>
  )
}