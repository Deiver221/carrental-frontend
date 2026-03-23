import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { APP_URL, APP_URL_D } from "../../auth/AuthContext"

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 animate-pulse flex items-center gap-4">
          <div className="w-20 h-14 rounded-xl bg-neutral-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-800 rounded w-1/3" />
            <div className="h-3 bg-neutral-800 rounded w-1/4" />
          </div>
          <div className="h-3 bg-neutral-800 rounded w-16" />
          <div className="h-3 bg-neutral-800 rounded w-16" />
          <div className="h-3 bg-neutral-800 rounded w-16" />
          <div className="h-8 bg-neutral-800 rounded-xl w-24" />
        </div>
      ))}
    </div>
  )
}

export default function ManageCars() {
  const navigate = useNavigate()

  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      const [brandsRes, categoriesRes] = await Promise.all([
        fetch(`${APP_URL}/brands`),
        fetch(`${APP_URL}/categories`),
      ])
      setBrands(await brandsRes.json())
      setCategories(await categoriesRes.json())
    }
    fetchFilters()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, brand, category])

  useEffect(() => {
    setLoading(true)
    const fetchCars = async () => {
      const user = localStorage.getItem("user")
      if (!user) return

      const token = JSON.parse(user).token
      const params = new URLSearchParams({ search, brand, category, page: String(page) })

      const response = await fetch(`${APP_URL}/cars?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      })
      const data = await response.json()
      setCars(data.data ?? [])
      setLastPage(data.last_page ?? 1)
      setTotal(data.total ?? 0)
      setLoading(false)
    }

    const delay = setTimeout(fetchCars, 400)
    return () => clearTimeout(delay)
  }, [search, brand, category, page])

  const handleDelete = async (id: number) => {
    const user = localStorage.getItem("user")
    if (!user) return

    const token = JSON.parse(user).token

    try {
      const response = await fetch(`${APP_URL}/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      })
      if (!response.ok) return
      setCars(prev => prev.filter(car => car.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.log(error)
    }
  }
  const handleToggleActive = async (id: number, currentState: boolean) => {
    const user = localStorage.getItem("user")
    if (!user) return

    const token = JSON.parse(user).token

    try {
      const response = await fetch(`${APP_URL}/cars/${id}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      })
      if (!response.ok) return

      setCars(prev =>
        prev.map(car => car.id === id ? { ...car, is_active: !currentState } : car)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const hasActiveFilters = search || brand || category

  const resetFilters = () => {
    setSearch("")
    setBrand("")
    setCategory("")
    setPage(1)
  }

  const inputClass = "bg-neutral-950 border border-neutral-700 focus:border-blue-600 focus:outline-none rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 transition-colors [color-scheme:dark]"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Modal de confirmación de eliminación */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="font-syne font-bold text-white text-lg mb-2">¿Eliminar vehículo?</h3>
            <p className="text-neutral-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all border border-neutral-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="font-dm bg-neutral-950 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-2xl text-white">Administrar vehículos</h1>
            <p className="text-neutral-500 text-xs mt-0.5">
              {loading ? "Cargando..." : `${total} vehículo${total !== 1 ? "s" : ""} en total`}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-car")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-syne font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar vehículo
          </button>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador */}
            <div className="relative flex-1 min-w-56">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por marca o modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} pl-9 w-full`}
              />
            </div>

            {/* Marca */}
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
              <option value="">Todas las marcas</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            {/* Categoría */}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

          {/* Tabla */}
          {loading ? <TableSkeleton /> : (
            <>
              {cars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">🚗</span>
                  <h3 className="font-syne font-bold text-white text-xl mb-2">No hay vehículos</h3>
                  <p className="text-neutral-500 text-sm mb-6">No encontramos resultados para tu búsqueda.</p>
                  <button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 bg-neutral-900/50">
                        <th className="px-6 py-4">Vehículo</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4">Año</th>
                        <th className="px-6 py-4">Precio/día</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {cars.map(car => (
                        <tr key={car.id} className="hover:bg-neutral-800/40 transition-colors">

                          {/* Vehículo */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={car.image.startsWith('http') 
                                  ? car.image 
                                  : `${APP_URL_D}/storage/${car.image}`
                                }
                                alt={car.model}
                                className="w-20 h-14 object-cover rounded-xl shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-white text-sm">
                                  {car.brand.name} {car.model}
                                </p>
                                <p className="text-neutral-500 text-xs mt-0.5">
                                  {car.seats} asientos · {car.transmission === "automatic" ? "Automático" : "Manual"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Categoría */}
                          <td className="px-6 py-4 text-sm text-neutral-400">{car.category.name}</td>

                          {/* Año */}
                          <td className="px-6 py-4 text-sm text-neutral-400">{car.year}</td>

                          {/* Precio */}
                          <td className="px-6 py-4">
                            <span className="font-syne font-bold text-white text-sm">${car.price_per_day}</span>
                            <span className="text-neutral-600 text-xs ml-1">/día</span>
                          </td>

                          {/* Estado */}
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              car.is_active
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                            }`}>
                              {car.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/cars/${car.id}`, "_blank")}
                                title="Ver página"
                                className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-700 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                                title="Editar"
                                className="p-2 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-600/10 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteId(car.id)}
                                title="Eliminar"
                                className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleToggleActive(car.id, car.is_active)}
                                title={car.is_active ? "Desactivar" : "Activar"}
                                className={`p-2 rounded-lg transition-all ${
                                  car.is_active
                                    ? "text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10"
                                    : "text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                }`}
                              >
                                {car.is_active ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </button>
                            </div>
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
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
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
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                          p === page ? "bg-blue-600 text-white" : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === lastPage}
                    onClick={() => setPage(page + 1)}
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