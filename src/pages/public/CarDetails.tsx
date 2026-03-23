import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import NavBar from "../../components/NavBar"
import { APP_URL, APP_URL_D } from "../../auth/AuthContext"

const fuelIcons: Record<string, string> = {
  gasoline: "⛽",
  diesel: "🛢️",
  electric: "⚡",
  hybrid: "🔋",
}

const transmissionLabel: Record<string, string> = {
  manual: "Manual",
  automatic: "Automático",
}
const fuelLabels: Record<string, string> = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  electric: "Eléctrico",
  hybrid: "Híbrido",
}

export default function CarDetails() {
  const { id } = useParams()
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [totalDays, setTotalDays] = useState(0)
  const [reservations, setReservations] = useState<any[]>([])

  useEffect(() => {
    const fetchReservations = async () => {
        const response = await fetch(`${APP_URL}/public/cars/${id}/reservations`)
        const data = await response.json()
        setReservations(Array.isArray(data) ? data : [])
      }
      fetchReservations()
  }, [id])


  useEffect(() => {
    
    const fetchCar = async () => {
      const response = await fetch(`${APP_URL}/public/cars/${id}`)
      const data = await response.json()
      setCar(data)
      setLoading(false)
    }
    fetchCar()
  }, [id])

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      setTotalDays(diff > 0 ? diff : 0)
    } else {
      setTotalDays(0)
    }
  }, [startDate, endDate])

  if (loading) {
    return (
      <div className="bg-neutral-950 flex items-center justify-center w-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center text-white">
        Vehículo no encontrado
      </div>
    )
  }

  const handleReservation = async () => {
    setError("")
    setSuccess("")

    const user = localStorage.getItem("user")
    if (!user) {
      setError("Inicia sesión para poder hacer una reserva")
      return
    }
    if (!startDate || !endDate) {
      setError("Por favor seleccione ambas fechas")
      return
    }
    if (totalDays <= 0) {
      setError("La fecha de retorno debe ser posterior a la fecha de inicio")
      return
    }

    const parsedUser = JSON.parse(user)
    const token = parsedUser.token

    try {
      const response = await fetch(`${APP_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Reservación fallida")
        return
      }

      setSuccess("¡Reservación creada correctamente!")
      setStartDate("")
      setEndDate("")
      setTotalDays(0)
    } catch {
      setError("Algo salió mal, intenta nuevamente")
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
      `}</style>

      <div className="font-dm bg-neutral-950 min-h-screen">
        <NavBar />
          <div className="max-w-6xl mx-auto px-6 mt-10 ">
            <Link to="/" className="text-sm text-blue-500 hover:text-blue-400 font-semibold transition-colors">← Volver a todos los vehículos</Link>
          </div>
        <main className="max-w-6xl mx-auto px-6 py-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Hero Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img
                  src={`${APP_URL_D}/storage/${car.image}`}
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                {/* Badge + Title */}
                <div className="absolute bottom-6 left-7">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30 mb-3">
                    {car.category?.name}
                  </span>
                  <h1 className="font-syne text-4xl sm:text-3xl font-extrabold text-white uppercase tracking-tight leading-tight">
                    {car.brand?.name} {car.model}
                  </h1>
                  <p className="text-blue-400 text-sm font-medium mt-1">{car.year}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: "💺", value: `${car.seats} Asientos`, label: "Capacidad" },
                  { icon: fuelIcons[car.fuel_type] ?? "⛽", value: fuelLabels[car.fuel_type] ?? car.fuel_type, label: "Combustible" },
                  { icon: "⚙️", value: transmissionLabel[car.transmission] ?? car.transmission, label: "Transmisión" },
                  { icon: "📅", value: car.year, label: "Año" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-600/40 hover:bg-blue-600/5 transition-all duration-200"
                  >
                    <span className="text-2xl mb-2">{stat.icon}</span>
                    <span className="font-syne font-bold text-sm text-white capitalize">{stat.value}</span>
                    <span className="text-xs text-neutral-500 mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section>
                <h2 className="font-syne font-bold text-lg text-white border-l-4 border-blue-600 pl-4 mb-4">
                  Descripción
                </h2>
                <p className="text-neutral-400 leading-relaxed text-sm">
                  {car.description || "Sin descripción disponible para este vehículo."}
                </p>
              </section>
              {/* Reservas del vehículo */}
                <section>
                    <h2 className="font-syne font-bold text-lg text-white border-l-4 border-blue-600 pl-4 mb-4">
                        Fechas no disponibles
                    </h2>

                    {reservations.length === 0 ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 text-sm">
                            <span>✅</span>
                            <span>Este vehículo está disponible en todas las fechas</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {reservations.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800"
                                >
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <span className="text-neutral-500">📅</span>
                                        <span>{new Date(r.start_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                        <span className="text-neutral-600">→</span>
                                        <span>{new Date(r.end_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                                        r.status === "confirmed"
                                            ? "bg-blue-600/10 text-blue-400 border-blue-600/20"
                                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    }`}>
                                        {r.status === "confirmed" ? "Confirmado" : "Pendiente"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* ── RIGHT COLUMN: Booking Card ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-5">

                {/* Price + badge */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-4xl font-extrabold text-blue-500">
                      ${car.price_per_day}
                    </span>
                    <span className="text-neutral-500 text-sm ml-1">/día</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-600/20">
                    Disponible
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-800" />

                {/* Date inputs */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                      Fecha de recogida
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-3 text-white text-sm transition-colors scheme:dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                      Fecha de devolución
                    </label>
                    <input
                      type="date"
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-3 text-white text-sm transition-colors scheme:dark"
                    />
                  </div>
                </div>

                {/* Price breakdown (aparece cuando hay fechas válidas) */}
                {totalDays > 0 && (
                  <>
                    <div className="h-px bg-neutral-800" />
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between text-neutral-400">
                        <span>${car.price_per_day} × {totalDays} día{totalDays > 1 ? "s" : ""}</span>
                        <span className="text-neutral-200">${(car.price_per_day * totalDays).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-px bg-neutral-800" />
                    <div className="flex justify-between items-center">
                      <span className="font-syne font-bold text-white">Total</span>
                      <span className="font-syne font-extrabold text-xl text-blue-500">
                        ${(car.price_per_day * totalDays).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {/* CTA Button */}
                <button
                  onClick={handleReservation}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-syne font-bold text-sm tracking-wide py-4 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/20"
                >
                  Reservar Ahora
                </button>

                <p className="text-center text-xs text-neutral-600">
                  No se realizará ningún cargo todavía
                </p>

                {/* Alerts */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
                    ⚠ {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
                    ✓ {success}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}