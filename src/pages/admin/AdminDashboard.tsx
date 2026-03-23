import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import { APP_URL } from "../../auth/AuthContext"

const COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#2563eb",
  completed: "#10b981",
  canceled: "#ef4444",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  canceled: "Cancelada",
}

const STAT_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  total:     { icon: "📊", color: "text-blue-400",   bg: "bg-blue-500/10" },
  active:    { icon: "🔄", color: "text-blue-400",   bg: "bg-blue-500/10" },
  completed: { icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  cars:      { icon: "🔑", color: "text-amber-400",  bg: "bg-amber-500/10" },
  revenue:   { icon: "💳", color: "text-blue-400",   bg: "bg-blue-500/10" },
  expected:  { icon: "💰", color: "text-indigo-400", bg: "bg-indigo-500/10" },
}

function StatCard({
  title, value, icon, bg, subtitle
}: {
  title: string, value: any, icon: string, bg: string, subtitle?: string
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-neutral-400">{title}</p>
        <span className={`text-xl p-2 rounded-xl ${bg}`}>{icon}</span>
      </div>
      <div className="mt-4">
        <h3 className=" text-3xl font-extrabold text-white">{value}</h3>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-neutral-400 mb-1">{label}</p>
        <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [reservationStatusData, setReservationStatusData] = useState<any[]>([])
  const [recentReservations, setRecentReservations] = useState<any[]>([])
  const [popularCars, setPopularCars] = useState<any[]>([])

  const getToken = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user).token : null
  }

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }

    Promise.all([
      fetch(`${APP_URL}/admin/dashboard`, { headers }).then(r => r.json()),
      fetch(`${APP_URL}/admin/stats`, { headers }).then(r => r.json()),
      fetch(`${APP_URL}/admin/reservations/status`, { headers }).then(r => r.json()),
      fetch(`${APP_URL}/admin/reservations?per_page=5`, { headers }).then(r => r.json()),
      fetch(`${APP_URL}/admin/popular-cars`, { headers }).then(r => r.json()),
    ]).then(([dashData, statsData, statusData, reservationsData, popularCarsData]) => {
  setStats(dashData)
  setRevenueData(statsData.monthly_revenue ?? [])
  setReservationStatusData(statusData ?? [])
  setRecentReservations(reservationsData.data?.slice(0, 5) ?? [])
  setPopularCars(popularCarsData ?? [])
})
  }, [])

  if (!stats) {
    return (
      <div className="bg-neutral-950 flex flex-col items-center justify-center w-full min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        <p className="text-neutral-400 text-sm">Cargando datos...</p>
      </div>
    )
  }

  const totalReservations = reservationStatusData.reduce((acc, e) => acc + e.total, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="font-dm bg-neutral-950 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className=" font-extrabold text-2xl text-white">Panel de Administración</h1>
            <p className="text-neutral-500 text-xs mt-0.5">Resumen general del negocio</p>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">

          {/* ── STAT CARDS ROW 1 ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Reservas Totales"
              value={stats.total_reservations}
              icon={STAT_ICONS.total.icon}
              bg={STAT_ICONS.total.bg}
            />
            <StatCard
              title="Reservas Activas"
              value={stats.active_reservations}
              icon={STAT_ICONS.active.icon}
              bg={STAT_ICONS.active.bg}
            />
            <StatCard
              title="Reservas Completadas"
              value={stats.completed_reservations}
              icon={STAT_ICONS.completed.icon}
              bg={STAT_ICONS.completed.bg}
            />
          </div>

          {/* ── STAT CARDS ROW 2 ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Vehículos en uso"
              value={stats.cars_in_use}
              icon={STAT_ICONS.cars.icon}
              bg={STAT_ICONS.cars.bg}
            />
            <StatCard
              title="Ingresos totales"
              value={`$${stats.total_revenue.toLocaleString()}`}
              icon={STAT_ICONS.revenue.icon}
              bg={STAT_ICONS.revenue.bg}
            />
            <StatCard
              title="Ingresos esperados"
              value={`$${stats.expected_revenue.toLocaleString()}`}
              icon={STAT_ICONS.expected.icon}
              bg={STAT_ICONS.expected.bg}
            />
          </div>

          {/* ── CHARTS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Bar chart */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-syne font-bold text-white text-lg">Ingresos por mes</h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  Realizado
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData} barSize={28}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Donut chart */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="font-syne font-bold text-white text-lg mb-6">Estado de reservas</h3>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={reservationStatusData}
                      dataKey="total"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {reservationStatusData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[entry.status]} strokeWidth={0} />
                      ))}
                    </Pie>
                  </PieChart>
                  {/* Centro del donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-extrabold text-2xl text-white">{totalReservations}</span>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Total</span>
                  </div>
                </div>

                {/* Leyenda */}
                <div className="w-full mt-6 space-y-3">
                  {reservationStatusData.map((entry, i) => {
                    const pct = totalReservations > 0
                      ? ((entry.total / totalReservations) * 100).toFixed(0)
                      : 0
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: COLORS[entry.status] }}
                          />
                          <span className="text-sm text-neutral-400">
                            {STATUS_LABELS[entry.status] ?? entry.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-600">{entry.total}</span>
                          <span className="font-syne font-bold text-sm text-white w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* ── TABLA RESERVAS RECIENTES ── */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-syne font-bold text-white text-lg">Reservas recientes</h3>
              <a href="/admin/manage-reservations" className="text-sm text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Ver todas →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 bg-neutral-900/50">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Fechas</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-400">
                        #{r.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {r.user?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-300">
                        {r.car?.brand?.name} {r.car?.model}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {new Date(r.start_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        <span className="text-neutral-600 mx-1">→</span>
                        {new Date(r.end_date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        ${r.total_price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          r.status === "confirmed"  ? "bg-blue-600/10 text-blue-400 border-blue-600/20" :
                          r.status === "completed"  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          r.status === "pending"    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                      "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* ── TABLA VEHÍCULOS POPULARES ── */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-syne font-bold text-white text-lg">Vehículos más alquilados</h3>
              <a href="/admin/manage-cars" className="text-sm text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Ver todos →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 bg-neutral-900/50">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Reservas</th>
                    <th className="px-6 py-4">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {popularCars.map((car, index) => (
                    <tr key={car.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`font-syne font-bold text-sm ${
                          index === 0 ? "text-amber-400" :
                          index === 1 ? "text-neutral-300" :
                          index === 2 ? "text-amber-700" :
                          "text-neutral-600"
                        }`}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {car.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-24 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${(car.total_reservations / popularCars[0].total_reservations) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-white">{car.total_reservations}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        ${car.total_revenue.toLocaleString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}