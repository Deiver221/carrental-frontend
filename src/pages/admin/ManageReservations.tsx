import { useEffect, useState } from "react"
import { APP_URL } from "../../auth/AuthContext"

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-600/10 text-blue-400 border-blue-600/20",
  canceled:  "bg-red-500/10 text-red-400 border-red-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pendiente",
  confirmed: "Confirmada",
  canceled:  "Cancelada",
  completed: "Completada",
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 animate-pulse flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-800 rounded w-1/3" />
            <div className="h-3 bg-neutral-800 rounded w-1/4" />
          </div>
          <div className="h-3 bg-neutral-800 rounded w-24" />
          <div className="h-6 bg-neutral-800 rounded-full w-20" />
          <div className="h-8 bg-neutral-800 rounded-xl w-28" />
        </div>
      ))}
    </div>
  )
}

type ModalAction = { id: number; action: "confirm" | "cancel" } | null

export default function ManageReservations() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [carSearch, setCarSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState<ModalAction>(null)
  const [processing, setProcessing] = useState(false)

  const getToken = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user).token : null
  }

  const fetchReservations = async (
    page = 1,
    filters = { status, userSearch, carSearch }
  ) => {
    setLoading(true)
    const token = getToken()
    if (!token) return

    const params = new URLSearchParams({ page: String(page) })
    if (filters.status)     params.append("status", filters.status)
    if (filters.userSearch) params.append("user", filters.userSearch)
    if (filters.carSearch)  params.append("car", filters.carSearch)

    const response = await fetch(`${APP_URL}/admin/reservations?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
    const data = await response.json()

    setReservations(data.data ?? [])
    setCurrentPage(data.current_page ?? 1)
    setLastPage(data.last_page ?? 1)
    setTotal(data.total ?? 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // Debounce en búsquedas de texto
  useEffect(() => {
    const delay = setTimeout(() => fetchReservations(1), 400)
    return () => clearTimeout(delay)
  }, [userSearch, carSearch])

  // Inmediato en cambio de status
  useEffect(() => {
    fetchReservations(1)
  }, [status])

  const handleConfirmAction = async () => {
    if (!modal) return
    setProcessing(true)

    const token = getToken()
    if (!token) return

    await fetch(`${APP_URL}/admin/reservations/${modal.id}/${modal.action}`, {
      method: "PATCH",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })

    setModal(null)
    setProcessing(false)
    fetchReservations(currentPage)
  }

  const resetFilters = () => {
    setStatus("")
    setUserSearch("")
    setCarSearch("")
    fetchReservations(1, { status: "", userSearch: "", carSearch: "" })
  }

  const hasActiveFilters = status || userSearch || carSearch

  const inputClass = "bg-neutral-950 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 transition-colors"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ── MODAL DE CONFIRMACIÓN ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              modal.action === "confirm" ? "bg-blue-600/10" : "bg-red-500/10"
            }`}>
              {modal.action === "confirm" ? (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              )}
            </div>
            <h3 className="font-syne font-bold text-white text-lg mb-2">
              {modal.action === "confirm" ? "¿Confirmar reserva?" : "¿Cancelar reserva?"}
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Esta acción puede afectar la disponibilidad del vehículo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                disabled={processing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-700"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processing}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 ${
                  modal.action === "confirm"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing ? "Procesando..." : modal.action === "confirm" ? "Sí, confirmar" : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="font-dm bg-neutral-950 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-2xl text-white">Administrar reservas</h1>
            <p className="text-neutral-500 text-xs mt-0.5">
              {loading ? "Cargando..." : `${total} reserva${total !== 1 ? "s" : ""} en total`}
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* ── FILTROS ── */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Buscar usuario */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            {/* Buscar vehículo */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar vehículo..."
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            {/* Estado */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${inputClass} scheme-dark`}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="canceled">Cancelada</option>
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors px-3 py-2.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar
              </button>
            )}
          </div>

          {/* ── TABLA ── */}
          {loading ? <TableSkeleton /> : (
            <>
              {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">📋</span>
                  <h3 className="font-syne font-bold text-white text-xl mb-2">No hay reservas</h3>
                  <p className="text-neutral-500 text-sm mb-6">No encontramos resultados para tu búsqueda.</p>
                  <button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Vehículo</th>
                        <th className="px-6 py-4">Fechas</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-neutral-800/40 transition-colors">

                          <td className="px-6 py-4 text-sm text-neutral-500 font-medium">
                            #{res.id}
                          </td>

                          <td className="px-6 py-4 text-sm text-white">
                            {res.user?.name ?? "—"}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-white">
                              {res.car?.brand?.name} {res.car?.model}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-neutral-400">
                            {new Date(res.start_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                            <span className="text-neutral-600 mx-1">→</span>
                            {new Date(res.end_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-syne font-bold text-white text-sm">${res.total_price?.toLocaleString()}</span>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_STYLES[res.status]}`}>
                              {STATUS_LABELS[res.status] ?? res.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {res.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setModal({ id: res.id, action: "confirm" })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setModal({ id: res.id, action: "cancel" })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <span className="text-neutral-600 text-xs">Sin acciones</span>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Paginación */}
              {lastPage > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => fetchReservations(currentPage - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-semibold disabled:opacity-40 hover:border-blue-600/50 hover:text-white transition-all disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => fetchReservations(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                          p === currentPage ? "bg-blue-600 text-white" : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === lastPage}
                    onClick={() => fetchReservations(currentPage + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-semibold disabled:opacity-40 hover:border-blue-600/50 hover:text-white transition-all disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}