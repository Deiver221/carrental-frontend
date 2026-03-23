import { useEffect, useState } from "react"
import NavBar from "../../components/NavBar"
import { APP_URL, APP_URL_D } from "../../auth/AuthContext"

type ModalAction = { id: number } | null

export default function MyReservations() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAllActive, setShowAllActive] = useState(false)
  const [modal, setModal] = useState<ModalAction>(null)
  const [processing, setProcessing] = useState(false)

  const fetchReservations = async () => {
    const user = localStorage.getItem("user")
    if (!user) {
      setError("No autenticado")
      setLoading(false)
      return
    }

    const parsedUser = JSON.parse(user)
    const token = parsedUser.token

    try {
      const response = await fetch(`${APP_URL}/my-reservations`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError("Error al cargar las reservas")
        setLoading(false)
        return
      }

      setReservations(data)
      setLoading(false)
    } catch {
      setError("Ocurrió un error")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const cancelReservation = async () => {
    if (!modal) return
    setProcessing(true)

    const user = localStorage.getItem("user")
    if (!user) return

    const token = JSON.parse(user).token

    const response = await fetch(`${APP_URL}/reservations/${modal.id}/cancel`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setModal(null)
      setProcessing(false)
      fetchReservations()
    }
  }

  const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      label: "Pendiente",
    },
    confirmed: {
      bg: "bg-blue-600/10",
      text: "text-blue-400",
      border: "border-blue-600/20",
      label: "Confirmada",
    },
    canceled: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      label: "Cancelada",
    },
    completed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      label: "Completada",
    },
  }

  const activeReservations = reservations.filter(
    (res) => res.status === "pending" || res.status === "confirmed"
  )

  const pastReservations = reservations.filter(
    (res) => res.status === "canceled" || res.status === "completed"
  )

  // Mostrar solo 5 inicialmente, o todas si showAllActive es true
  const displayedActiveReservations = showAllActive 
    ? activeReservations 
    : activeReservations.slice(0, 5)

  if (loading) {
    return (
      <div className="bg-neutral-950 flex flex-col items-center justify-center w-full min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        <p className="text-neutral-400 text-sm">Cargando reservas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <span className="text-5xl mb-4 block">⚠️</span>
          <p className="text-neutral-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ── MODAL DE CONFIRMACIÓN ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-500/10">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="font-syne font-bold text-white text-lg mb-2">
              ¿Cancelar reserva?
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Esta acción no se puede revertir y afectará la disponibilidad del vehículo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                disabled={processing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-700 disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={cancelReservation}
                disabled={processing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 bg-red-600 hover:bg-red-700"
              >
                {processing ? "Procesando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="font-dm bg-neutral-950 min-h-screen">
        <NavBar />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-syne text-4xl font-extrabold text-white mb-2">
              Mis Reservas
            </h1>
            <p className="text-neutral-500 text-sm">
              Gestiona tus reservas activas y revisa tu historial
            </p>
          </div>

          {/* ── RESERVAS ACTIVAS ── */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-xl text-white flex items-center gap-3">
                <span className="w-1 h-6 bg-blue-600 rounded-full" />
                Reservas Activas
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-bold border border-blue-600/20">
                {activeReservations.length} activa{activeReservations.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {activeReservations.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
                  <span className="text-5xl mb-4 block">📅</span>
                  <h3 className="font-syne font-bold text-white text-lg mb-2">
                    No tienes reservas activas
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">
                    Explora nuestro catálogo y encuentra tu vehículo ideal
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Ver vehículos disponibles
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ) : (
                <>
                  {displayedActiveReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start hover:border-blue-600/40 hover:shadow-lg hover:shadow-blue-600/5 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="w-full md:w-56 h-40 rounded-xl bg-neutral-800 overflow-hidden shrink-0">
                        <img
                          src={res.car.image.startsWith('http') 
                        ? res.car.image 
                        : `${APP_URL_D}/storage/${res.car.image}`
                      }
                          alt={res.car.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between gap-4 w-full">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-syne font-bold text-xl text-white">
                                {res.car.brand.name} {res.car.model}
                              </h3>
                              <p className="text-neutral-500 text-sm">{res.car.category?.name} • {res.car.year}</p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                statusConfig[res.status].bg
                              } ${statusConfig[res.status].text} ${statusConfig[res.status].border}`}
                            >
                              {statusConfig[res.status].label}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>
                                {new Date(res.start_date).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                                <span className="text-neutral-600 mx-2">→</span>
                                {new Date(res.end_date).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer: Price + Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                          <div>
                            <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wider">
                              Total
                            </p>
                            <p className="text-2xl font-extrabold text-blue-500">
                              ${res.total_price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {res.status === "pending" && (
                              <button
                                onClick={() => setModal({ id: res.id })}
                                className="px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 text-sm font-semibold transition-all"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón "Mostrar más" */}
                  {activeReservations.length > 5 && !showAllActive && (
                    <button
                      onClick={() => setShowAllActive(true)}
                      className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-blue-600/40 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Mostrar {activeReservations.length - 5} reserva{activeReservations.length - 5 !== 1 ? "s" : ""} más
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Botón "Mostrar menos" */}
                  {showAllActive && activeReservations.length > 5 && (
                    <button
                      onClick={() => setShowAllActive(false)}
                      className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-blue-600/40 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Mostrar menos
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ── HISTORIAL ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-xl text-white flex items-center gap-3">
                <span className="w-1 h-6 bg-neutral-700 rounded-full" />
                Historial de Reservas
              </h2>
              <span className="text-neutral-500 text-xs font-semibold">
                {pastReservations.length} completada{pastReservations.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {pastReservations.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="text-5xl mb-4 block opacity-50">📦</span>
                  <p className="text-neutral-500 text-sm">No hay reservas en el historial</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 bg-neutral-900/50">
                      <tr>
                        <th className="px-6 py-4">Vehículo</th>
                        <th className="px-6 py-4 hidden md:table-cell">Fechas</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {pastReservations.map((res) => (
                        <tr
                          key={res.id}
                          className="hover:bg-neutral-800/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                                <img
                                  src={`${APP_URL_D}/storage/${res.car.image}`}
                                  alt={res.car.model}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {res.car.brand.name} {res.car.model}
                                </p>
                                <p className="text-xs text-neutral-500">{res.car.year}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="text-sm text-neutral-300">
                              {new Date(res.start_date).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                              })}
                              <span className="text-neutral-600 mx-1">→</span>
                              {new Date(res.end_date).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-white">
                              ${res.total_price}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                statusConfig[res.status].bg
                              } ${statusConfig[res.status].text} ${
                                statusConfig[res.status].border
                              }`}
                            >
                              {statusConfig[res.status].label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
